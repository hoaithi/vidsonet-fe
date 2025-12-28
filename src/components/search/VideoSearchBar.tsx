import React, { useState, useEffect, useRef } from 'react';

/**
 * ============================================================================
 * TYPESCRIPT TYPES & INTERFACES
 * ============================================================================
 */

// Category type (adjust theo backend của bạn)
interface Category {
  id: number;
  name: string;
}

// Props cho VideoSearchBar component
interface VideoSearchBarProps {
  onSearch: (query: string) => void;
  categories?: Category[];
  // Props mới để sync state với parent
  externalSearchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

/**
 * ============================================================================
 * CUSTOM HOOK: useSearchHistory
 * ============================================================================
 * Ý TƯỞNG:
 * - Quản lý lịch sử tìm kiếm của user
 * - Lưu trữ persistent (localStorage) để giữ lại khi refresh
 * - Tự động deduplicate và giới hạn số lượng
 * 
 * LUỒNG CHẠY:
 * 1. Mount component → Load history từ localStorage
 * 2. User search → addToHistory() → Save to localStorage
 * 3. User xóa item → removeFromHistory() → Update localStorage
 * 4. User xóa all → clearHistory() → Clear localStorage
 */
/**
 * CUSTOM HOOK: useSearchHistory
 * Return type được define rõ ràng
 */
interface UseSearchHistoryReturn {
  history: string[];
  addToHistory: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
}

const useSearchHistory = (maxItems: number = 10): UseSearchHistoryReturn => {
  // State lưu danh sách history
  const [history, setHistory] = useState<string[]>([]);

  // BƯỚC 1: Load history từ localStorage khi component mount
  useEffect(() => {
    const saved = localStorage.getItem('videoSearchHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []); // Empty dependency = chỉ chạy 1 lần khi mount

  // BƯỚC 2: Thêm query mới vào history
  const addToHistory = (query: string) => {
    if (!query.trim()) return; // Ignore empty query
    
    setHistory(prev => {
      // 2.1: Loại bỏ duplicate (case-insensitive)
      const filtered = prev.filter(item => 
        item.toLowerCase() !== query.toLowerCase()
      );
      
      // 2.2: Thêm query mới lên đầu mảng
      // 2.3: Giới hạn maxItems (mặc định 10)
      const newHistory = [query, ...filtered].slice(0, maxItems);
      
      // 2.4: Lưu vào localStorage
      localStorage.setItem('videoSearchHistory', JSON.stringify(newHistory));
      
      return newHistory;
    });
  };

  // BƯỚC 3: Xóa 1 item khỏi history
  const removeFromHistory = (query: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item !== query);
      localStorage.setItem('videoSearchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  // BƯỚC 4: Xóa toàn bộ history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('videoSearchHistory');
  };

  // Return các hàm và state để component sử dụng
  return { history, addToHistory, removeFromHistory, clearHistory };
};

/**
 * ============================================================================
 * COMPONENT: VideoSearchBar
 * ============================================================================
 * Ý TƯỞNG:
 * - Thanh search với autocomplete dropdown
 * - Hiển thị: suggestions (khi đang gõ), history (khi focus rỗng), trending
 * - UX: click outside đóng dropdown, enter để search
 * 
 * LUỒNG CHẠY CHÍNH:
 * 1. User focus input → showDropdown = true
 * 2. User gõ text → filter suggestions realtime
 * 3. User click suggestion/history/trending → execute search
 * 4. Search execute → save to history → gọi API
 * 5. Click outside → đóng dropdown
 */
export const VideoSearchBar: React.FC<VideoSearchBarProps> = ({ 
  onSearch, 
  categories,
  externalSearchQuery,
  onSearchQueryChange 
}) => {
  // ===== STATES =====
  // Sử dụng externalSearchQuery nếu có, không thì dùng internal state
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const trendingSearches = [
    'React tutorial',
    'JavaScript tips',
    'Web development',
    'UI/UX design',
    'Programming basics'
  ];

  // ===== EFFECT 1: Click Outside để đóng dropdown =====
  /**
   * LUỒNG:
   * 1. User click anywhere trên page
   * 2. Check: click có nằm trong dropdown không?
   * 3. Nếu KHÔNG → đóng dropdown
   * 4. Cleanup listener khi unmount
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ===== EFFECT 2: Filter suggestions realtime =====
  /**
   * LUỒNG:
   * 1. User gõ text → searchQuery thay đổi
   * 2. Nếu có text:
   *    a. Combine history + trending
   *    b. Filter items có chứa searchQuery (case-insensitive)
   *    c. Remove duplicate
   *    d. Lấy tối đa 8 items
   * 3. Nếu rỗng → không hiện suggestions
   * 
   * VÍ DỤ:
   * - User gõ "reac" → show "React tutorial" từ trending
   * - User gõ "java" → show "JavaScript tips" từ trending
   */
  useEffect(() => {
    if (searchQuery.trim()) {
      // Combine tất cả sources
      const allSuggestions = [...history, ...trendingSearches];
      
      // Filter based on query
      const filtered = allSuggestions.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Remove duplicates và limit
      setSuggestions([...new Set(filtered)].slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, history]); // Re-run khi query hoặc history thay đổi

  // ===== HANDLER 1: Execute Search =====
  /**
   * LUỒNG CHÍNH - Khi user thực hiện search:
   * 1. Validate: query không rỗng
   * 2. Save query vào history (localStorage)
   * 3. Gọi callback onSearch() → trigger API call ở parent
   * 4. Đóng dropdown
   * 
   * ĐƯỢC GỌI TỪ:
   * - User nhấn Enter
   * - User click button search
   * - User click vào suggestion/history/trending item
   */
  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToHistory(query);        // Save to history
      onSearch(query);             // Callback to parent → API call
      setShowDropdown(false);      // Close dropdown
    }
  };

  // ===== HANDLER 2: Input Change =====
  /**
   * LUỒNG:
   * 1. User gõ → update searchQuery state
   * 2. Nếu có onSearchQueryChange callback → sync với parent
   * 3. Effect 2 tự động trigger → filter suggestions
   * 4. Hiện dropdown để show suggestions
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Update internal state nếu không có external control
    if (externalSearchQuery === undefined) {
      setInternalSearchQuery(newValue);
    }
    
    // Sync với parent nếu có callback
    if (onSearchQueryChange) {
      onSearchQueryChange(newValue);
    }
    
    setShowDropdown(true);
  };

  // ===== HANDLER 3: Keyboard =====
  /**
   * LUỒNG:
   * User nhấn Enter → execute search với current query
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* ===== SEARCH INPUT ===== */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}  // Gõ text
          onFocus={() => setShowDropdown(true)}  // Focus → hiện dropdown
          onKeyDown={handleKeyDown}  // Enter → search
          placeholder="Tìm kiếm video..."
          className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleSearch(searchQuery)}  // Click icon → search
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* ===== DROPDOWN: 3 SECTIONS ===== */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          
          {/* SECTION 1: SUGGESTIONS (hiện khi user đang gõ) */}
          {searchQuery && suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs text-gray-500 font-semibold uppercase">
                Gợi ý
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  onClick={() => {
                    // Update cả internal và external state nếu cần
                    if (externalSearchQuery === undefined) {
                      setInternalSearchQuery(suggestion);
                    }
                    if (onSearchQueryChange) {
                      onSearchQueryChange(suggestion);
                    }
                    handleSearch(suggestion);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* SECTION 2: HISTORY (hiện khi input rỗng và có history) */}
          {!searchQuery && history.length > 0 && (
            <div className="py-2 border-t">
              <div className="px-4 py-1 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold uppercase">
                  Tìm kiếm gần đây
                </span>
                <button
                  onClick={clearHistory}  // Xóa toàn bộ history
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Xóa tất cả
                </button>
              </div>
              {history.map((item, index) => (
                <div
                  key={`history-${index}`}
                  className="px-4 py-2 hover:bg-gray-100 flex items-center justify-between group"
                >
                  <button
                    onClick={() => {
                      // Update cả internal và external state
                      if (externalSearchQuery === undefined) {
                        setInternalSearchQuery(item);
                      }
                      if (onSearchQueryChange) {
                        onSearchQueryChange(item);
                      }
                      handleSearch(item);
                    }}
                    className="flex-1 text-left flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{item}</span>
                  </button>
                  {/* Icon X chỉ hiện khi hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // Prevent trigger parent click
                      removeFromHistory(item);  // Xóa item này
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SECTION 3: TRENDING (hiện khi input rỗng) */}
          {!searchQuery && (
            <div className="py-2 border-t">
              <div className="px-4 py-1 text-xs text-gray-500 font-semibold uppercase">
                Tìm kiếm phổ biến
              </div>
              {trendingSearches.map((trend, index) => (
                <button
                  key={`trend-${index}`}
                  onClick={() => {
                    // Update cả internal và external state
                    if (externalSearchQuery === undefined) {
                      setInternalSearchQuery(trend);
                    }
                    if (onSearchQueryChange) {
                      onSearchQueryChange(trend);
                    }
                    handleSearch(trend);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                  </svg>
                  <span>{trend}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};