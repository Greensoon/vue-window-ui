export function isMobile () {
	return document.body && document.body.offsetWidth < 800
}

export function shouldCollapseMenu() {
	return document.body && document.body.offsetWidth <= 1092
}