(($) ->
	$ ->
		collapse = $ '.button-collapse'

		if collapse?
			collapse.sideNav()

		parallax = $ '.parallax' 

		if parallax?
			parallax.parallax()

		$container = $ '#masonry-grid'

		if $container?
			$container.masonry {columnWidth: '.col', itemSelector: '.col'}

		slider = $ '.slider'

		if slider?
			slider.slider {full_width: true}

) jQuery

