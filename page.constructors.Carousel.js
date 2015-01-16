PAGE.add("Constructors.Carousel", function DogCarousel($root, $legend, $next, $back, options) {

	var MOVESTYLE = { slideLeft : 1 }
	, o = options = options || {}

	o.slidesParentClass = o.slidesParentClass || ".slidesWrap"
	o.slideWrapParent = o.slideWrapParent || ".slidesWrap .slides"

	options.moveStyle = options.moveStyle || MOVESTYLE.slideLeft
	options.slideClass = options.slideClass || ".slide"
	options.noLightbox = options.noLightbox || false
	options.ieMode = options.ieMode || false
	options.parentWidth

	var dog = {
		options : options
		, totalSlides : 0
		, currentSlide : 0
		, $slidesParent : $root.find(o.slidesParentClass)
		, $slidesWrapParent : $root.find(o.slideWrapParent)
		, $allSlides : $root.find(o.slideWrapParent).children()
		, slideStartX : []
		, $next : $next
		, $back : $back
		, $legend : $legend
	}

	PAGE.ext.events(dog, {
		goNext : [ ]
		, goPrev : [ ]
		, goTo : [ ]
	})

	function showRelevant() {
		if (dog.currentSlide === 0) {
			dog.$back.addClass("faded")
		}

		if (dog.currentSlide < dog.totalSlides) {
			dog.$next.removeClass("faded")
		}

		if (dog.currentSlide > 0 && dog.totalSlides > 1) {
			dog.$back.removeClass("faded")
		}

		if (dog.currentSlide === dog.totalSlides -1) {
			dog.$next.addClass("faded")
		}

		generateLegend()
	}

	function generateLegend() {
		var html = "<b>" + (dog.currentSlide + 1) + "</b> out of <b>" + dog.totalSlides + "</b>"
		dog.$legend.html(html)
	}

	function showLightbox($this) {
		// blank, used to do stuff
	}

	var goTo = dog.goTo = function(index) {
		var tempDelay = 0

		dog.currentSlide = index

		switch(options.moveStyle) {
		case MOVESTYLE.slideLeft : 
			slideLeft(index, function() {
				// callback for stuff
			})
			break
		}
		showRelevant()

		dog.triggerEvent("goTo", index, dog)

	}

	var slideLeft = dog.slideLeft = function(index, callback) {
		dog.$slidesWrapParent.animate({ marginLeft: (-1 * dog.slideStartX[index]) }, function() {
			typeof callback === "function" && callback()
		})
	}

	var goNext = dog.goNext = function() {
		if (dog.currentSlide < dog.totalSlides - 1) {
			goTo(dog.currentSlide+1)
		}

		dog.triggerEvent("goNext", dog.currentSlide, dog)
	}

	var goPrev = dog.goPrev = function() {
		if (dog.currentSlide > 0) {
			goTo(dog.currentSlide-1)
		}

		dog.triggerEvent("goPrev", dog.currentSlide, dog)
	}

	var openSlide = dog.openSlide = function(index) {
		showLightbox(dog.$allSlides.eq(index))
	}

	function events() {
		var ignore = false
		, ignoreTime = 200

		dog.$next.click(goNext)

		dog.$back.click(goPrev)

		dog.$slidesParent.on("swipeleft", function() {
			ignore = true
			ignoreTime = 1000
			goNext()
		})

		dog.$slidesParent.on("swiperight", function() {
			ignore = true
			ignoreTime = 1000
			goPrev()
		})
	}

	function init() {
		o.parentWidth = o.parentWidth || dog.$slidesParent.parent().width()

		dog.$allSlides.width(o.parentWidth)
		// compute slides
		dog.$allSlides.each(function() {
			dog.totalSlides += 1
			dog.slideStartX.push($(this).position().left)
		}).width(o.parentWidth)

		events()
		showRelevant()
	}

	init()

	return dog

})
