 $ ->
	collapse = $ '.button-collapse'

	if collapse?
		collapse.sideNav()

	parallax = $ '.parallax' 

	if parallax?
		parallax.parallax()
