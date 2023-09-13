/**
 * Initialize the options for the select input by formatting the default and variable values array.
 * @param {Array} variables - Array of plugin variables values.
 * @param {Array} defaultValues - Array of attribute default values.
 * @returns {Array} Array of objects representing the default and variable values.
 */
export function initSelectOptions(variables, defaultValues) {
  const categories = [...new Set(variables.map(({ category }) => category))];
  const children = categories.map((category) => ({
    type: 'category',
    name: category,
    children: variables
      .filter((variable) => variable.category === category)
      .map((variable) => ({
        type: 'item',
        name: variable.name,
        value: variable.value !== null ? variable.value : variable.defaultValue,
        formattedName: variable.formattedName,
      })),
  }));

  return [{
    type: 'category',
    name: 'plugin.component.attribute.selectInput.defaultValue',
    children: defaultValues.map((value) => ({
      type: 'item',
      value,
    })),
  }, {
    type: 'category',
    name: 'plugin.component.attribute.selectInput.variables',
    children,
  }];
}
