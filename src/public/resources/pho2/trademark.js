
(() => {

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
	document.body.appendChild(trademark);
})()