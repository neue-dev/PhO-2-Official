/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-31 13:11:51
 * @ Modified time: 2024-11-01 00:09:02
 * @ Description:
 * 
 * The component interface defines a means for us to create reusable DOM elements.
 */

/**
 * Component factory.
 */
const C = (() => {

	// Interface
	const _ = {};

	/**
	 * Applies the properties to the element.
	 * 
	 * @param props			The properties to apply to the element. 
	 * @param element 	The element to modify.
	 * @return 					The modified element.
	 */
	const apply = (props, element) => (
		Object.keys(props).map(prop => 
			Array.isArray(props[prop])
				? element[prop](...props[prop])
				: element[prop](props[prop])),
		element
	)

	/**
	 * Creates a component builder.
	 * Returns a function that constructs components.
	 * The resulting function is capable of applying styles and mofification passed into it.
	 * 
	 * @param	component		An element decorated by the DOM module.
	 * @return						A 'constructor' function with extra functionality.
	 */
	_.new = (component) => (
		
		// Returns a new function that accepts props
		(props={}, ...args) => (

			// Extend the component
			((component) => (

				// For each of the props associated with modifying the component
				((child_props, method_props) => (

					// Apply to component
					apply(method_props, component),

					// Apply child modifications
					Object.keys(child_props).map(
						child => apply(
							child_props[child], 
					
							// Replace [child_name] with child_name 
							component.select(child.replace(/^\[+|\]+$/g, ''))
						)
					)

				// Pass in appropriate props
				))(

					// Child props
					Object.keys(props).reduce(
						(accumulator, prop) => 
							prop.startsWith('[') 
								? accumulator
								: { ...accumulator, [prop]: props[prop] }, 
					{}),

					// Method props
					Object.keys(props).reduce(
						(accumulator, prop) => 
							prop.startsWith('[') 
								? { ...accumulator, [prop]: props[prop] } 
								: accumulator,
					{})
				),/**
				* A library of common components.
				*/

				// Return the modified component
				component

			// Pass in the actual component
			))(component(...args))
		)
	)

	// A library of common components
	_.LIB = {

		// Table components
		tr: _.new(() => DOM.tr().c('tr')),
		td: _.new(() => DOM.td().c('td')),

		// Generic tags
		div: _.new(() => DOM.div()),
		span: _.new(() => DOM.span()),
		link: _.new(() => DOM.link()),
		
		// UI components
		or: _.new(() => DOM.or()),
		label: _.new(() => DOM.label().c('ui', 'label')),
		button: _.new(() => DOM.button().c('ui', 'button')),
		buttons: _.new(() => DOM.buttons().c('buttons')),

		// Misc
		sup: _.new(() => DOM.sup()),
		br: _.new(() => DOM.br()),
		pre: _.new(() => DOM.pre())
	}

	return {
		..._
	}

})()