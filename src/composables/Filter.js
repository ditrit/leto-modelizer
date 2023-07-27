/**
 * Indicate if text contains searched text.
 * @param {string} textToFilter - Text to filter.
 * @param {string} textToSearch - Text to search.
 * @returns {boolean} True if `textToFilter` contains `textToSearch` otherwise false.
 */
export function searchText(textToFilter, textToSearch) {
  if (!textToSearch || textToSearch.trim().length === 0) {
    return true;
  }

  return textToSearch.toLowerCase().split(' ')
    .filter((searchedText) => searchedText !== '')
    .some((searchedText) => textToFilter.toLowerCase().includes(searchedText));
}
