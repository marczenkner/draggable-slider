//(function($) {

    function DraggableSlider(target, arrayValues, sliderSettings) {

        let sliderValues = arrayValues,
            sliderValuesLength = Math.round(sliderValues.length),
            sliderContainer = $(target),
            sliderButton = sliderContainer.children('.slider-button'),
            sliderRange = sliderContainer.children('.slider-range'),
            sliderContainerWidth = Math.round(sliderContainer.outerWidth()),
            sliderButtonWidth = Math.round($(sliderButton).width()),
            ratio = Math.round(sliderContainerWidth / (sliderValuesLength - 1)),
            snapPoints = [],
            showLines = sliderSettings.showLines || true,
            showNumbers = sliderSettings.showNumbers || true,
            showRange = sliderSettings.showRange || true,
            clickPosition = sliderSettings.clickPosition || true;

        // Generate the points our slider will snap to
        function _generateSnapPoints() {
            let snapIncement = 0;
            for (let i = 0; i < sliderValues.length; i++) {
                snapPoints.push(Math.round(snapIncement));
                snapIncement += Math.round(ratio);
            };

            // If the last item in the snapPoints array is larger or smaller than the width of our slider, set it to the last value
            if (snapPoints[sliderValuesLength - 1] !== sliderContainerWidth) {
                snapPoints[sliderValuesLength - 1] = sliderContainerWidth;
            }
        }

        // generates the boxes used for tapping, lines and numberss
        function _generateTapBoxes() {
            $(snapPoints).each(function (index) {
                if (clickPosition) {
                    $(sliderContainer).append('<div class="slider-tap-box">' + sliderValues[index] + '</div>');
                }
            });
            $(sliderContainer).children('.slider-tap-box').each(function (index) {
                if(showNumbers){
                    $(this).html(sliderValues[index]);
                }
            });
            $(sliderContainer).children('.slider-tap-box').each(function (index) {
                $(this).css({
                    width: (sliderContainerWidth / (sliderValuesLength - 1)),
                    left: (snapPoints[index]),
                    transform: 'translateX(-50%)'
                });
            });
        }

        // Generate our range div
        function _generateRangeDiv() {
            if (showRange) {
                sliderRange.css({
                    display: 'block',
                    width: sliderButton.position().left
                });
            }
        }

        console.log(snapPoints);
        console.log('The slider width is ' + sliderContainerWidth);
        console.log('The ratio is ' + ratio);
        console.log('The number of values is ' + sliderValuesLength);

        // Get values
        function _getValues() {
            var sliderButtonOffset = sliderButton.position(),
                valueIndex = (Math.round((Math.round(sliderButtonOffset.left)) / ratio));
            $('#slider-values').append(sliderValues[valueIndex]);
            return sliderValues[valueIndex];
        }

        function initSlider() {
            _generateSnapPoints();
            _generateTapBoxes();
            _getValues();
        }

        initSlider();

        // If the clickPosition var is true
        if (clickPosition) {
            $(sliderContainer).children('.slider-tap-box').click(function () {
                var valueIndex = (Math.round((Math.round($(this).position().left)) / ratio) + 1);
                TweenMax.to(sliderButton, 0.5, {
                    x: (valueIndex * ratio),
                    onUpdate: _generateRangeDiv()
                });
                _getValues();
            })
        }

        Draggable.create(sliderButton, {
            type: "x",
            snap: snapPoints,
            throwProps: true,
            bounds: {
                left: Math.round(($(sliderContainer).position().left) - (sliderButtonWidth / 2)),
                width: (sliderContainerWidth + sliderButtonWidth)
            },
            onDrag: _generateRangeDiv,
            onThrowUpdate: _generateRangeDiv,
            onThrowComplete: _getValues
        });

    }


//})(jQuery);