/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-04 13:45:48
 * @ Modified time: 2024-11-11 18:07:14
 * @ Description: 
 * 
 * yes
 */

const Trademark = (() => {

	// Create the trademark
	const trademark = DOM.link()
		.ref('https://www.linkedin.com/in/m-david-6192222b2/')
		.a('target', '_blank')
		.append(
			DOM.div().c('trademark').t('website by: ')
				.append(
					DOM.span().append(DOM.b().t('Mo David'))
				)
		)

	// Append the trademark
	DOM.append(trademark);
})();