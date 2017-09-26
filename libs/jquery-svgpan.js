
/*global define, jQuery, window*/

(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    "use strict";
    var NONE = 0,
        PAN = 1,
        DRAG = 2,
        init = function (root, svgRoot, enablePan, enableZoom, enableDrag, zoomScale, params) {

            var state = NONE,
                stateTarget,
                stateOrigin,
                stateTf,
                svgDoc = root,
                $root = $(root),
                $parent = $root.parent(),
                recentOffset = $root.offset(),

                // FF sometimes doesn't calculate this anything near correctly
                // for SVGs.
                offsetIsBroken = Math.abs($root.offset().left) > 1e5,
                isMouseOverElem = false,
                min_zoom = params && params.min_zoom ? params.min_zoom : 0.1,
                max_zoom = params && params.max_zoom ? params.max_zoom :  1.5,

                /**
                 * Dumps a matrix to a string (useful for debug).
                 */
                dumpMatrix = function (matrix) {
                    var s = "[ " + matrix.a + ", " + matrix.c + ", " + matrix.e + "\n  " + matrix.b + ", " + matrix.d + ", " + matrix.f + "]";

                    return s;
                },

                /**
                 * Instance an SVGPoint object with given event coordinates.
                 */
                getEventPoint = function (evt) {
                    var p = root.createSVGPoint(),
                        offsetX = evt.offsetX,
                        offsetY = evt.offsetY,
                        offset,
                        ctm,
                        matrix;

                    if (typeof offsetX === "undefined" || typeof offsetY === "undefined") {
                        offset = offsetIsBroken ? $parent.offset() : recentOffset;
                        offsetX = evt.pageX - offset.left;
                        offsetY = evt.pageY - offset.top;
                    }

                    p.x = offsetX;
                    p.y = offsetY;

                    return p;
                },

                /**
                 * Sets the current transform matrix of an element.
                 */
                setCTM = function (element, matrix) {
                    var s = "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";
                    // console.log(matrix.a, matrix.d)

                    element.setAttribute("transform", s);
                },

                /**
                 * Handle mouse wheel event.
                 */
                handleMouseWheel = function (evt) {
                    if (!enableZoom) {
                        return;
                    }

                    if (!isMouseOverElem) {
                        return;
                    }

                    if (evt.preventDefault) {
                        evt.preventDefault();
                    }

                    evt.returnValue = false;
                    recentOffset = $root.offset();

                    var delta = evt.wheelDelta ? evt.wheelDelta / 360 : evt.detail / -9,
                        z = Math.pow(1 + zoomScale, delta),
                        g = svgRoot,
                        p = getEventPoint(evt),
                        k;


                    var get_ctm = g.getCTM()
                    var new_s = get_ctm.a * z;


                    if(min_zoom < new_s && new_s < max_zoom){

                        p = p.matrixTransform(g.getCTM().inverse());

                        // Compute new scale matrix in current mouse position
                        k = root.createSVGMatrix().translate(p.x, p.y).scale(z).translate(-p.x, -p.y);

                        setCTM(g, g.getCTM().multiply(k));

                        if (typeof stateTf === "undefined") {
                            stateTf = g.getCTM().inverse();
                        }

                        stateTf = stateTf.multiply(k.inverse());
                    }
                },

                /**
                 * Handle mouse move event.
                 */
                handleMouseMove = function (evt) {

                    if (evt.preventDefault) {
                        evt.preventDefault();
                    }

                    evt.returnValue = false;

                    var g = svgRoot,
                        p;

                    if (state === PAN && enablePan) {
                        // Pan mode
                        p = getEventPoint(evt).matrixTransform(stateTf);

                        setCTM(g, stateTf.inverse().translate(p.x - stateOrigin.x, p.y - stateOrigin.y));
                    } else if (state === DRAG && enableDrag) {
                        // Drag mode
                        p = getEventPoint(evt).matrixTransform(g.getCTM().inverse());

                        setCTM(stateTarget, root.createSVGMatrix().translate(p.x - stateOrigin.x, p.y - stateOrigin.y).multiply(g.getCTM().inverse()).multiply(stateTarget.getCTM()));

                        stateOrigin = p;
                    }
                },

                /**
                 * Handle mouseenter event.  This has been added to stop ignoring
                 * inputs when the mouse is over the element.
                 **/
                handleMouseEnter = function (evt) {
                    // bind our mousemove listener only when we have mouse in view
                    if (!isMouseOverElem) {
                        recentOffset = $root.offset();
                        $root.bind('mousemove', handleMouseMove);
                        isMouseOverElem = true;
                    }
                },


                handleMouseLeave = function (evt) {
                    // unbind our mousemove listener only when we no longer have mouse in view
                    if (isMouseOverElem) {
                        $root.unbind('mousemove', handleMouseMove);
                        isMouseOverElem = false;
                    }
                    state = NONE;
                },

                handleMouseDown = function (evt) {
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    }

                    evt.returnValue = false;

                    //var svgDoc = evt.target.ownerDocument;

                    //var g = getRoot(svgDoc);
                    var g = svgRoot;

                    // Pan anyway when drag is disabled and the user clicked on an element
                    if (evt.target.tagName === "svg" || !enableDrag) {
                        // Pan mode
                        state = PAN;

                        stateTf = g.getCTM().inverse();

                        stateOrigin = getEventPoint(evt).matrixTransform(stateTf);
                    } else {
                        // Drag mode
                        state = DRAG;

                        stateTarget = evt.target;

                        stateTf = g.getCTM().inverse();

                        stateOrigin = getEventPoint(evt).matrixTransform(stateTf);
                    }
                },

                handleMouseUp = function (evt) {
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    }

                    evt.returnValue = false;

                    //var svgDoc = evt.target.ownerDocument;

                    if (state === PAN || state === DRAG) {
                        // Quit pan mode
                        state = NONE;
                    }
                };

            /**
             * Register handlers
             */

            // MODIFICATION: registers events through jQuery
            $root.bind('mouseup', handleMouseUp)
                .bind('mousedown', handleMouseDown)
                .bind('mouseenter', handleMouseEnter)
                .bind('mouseleave', handleMouseLeave);

            //if (navigator.userAgent.toLowerCase().indexOf('webkit') >= 0) {

            window.addEventListener('mousewheel', handleMouseWheel, false); // Chrome/Safari/others
            window.addEventListener('DOMMouseScroll', handleMouseWheel, false); // Firefox

            root.destroy = function(){
                window.removeEventListener('mousewheel', handleMouseWheel, false); // Chrome/Safari/others
                window.removeEventListener('DOMMouseScroll', handleMouseWheel, false); // Firefox
            }

        };

    /**
       Enable SVG panning on an SVG element.

       @param viewportId the ID of an element to use as viewport for pan.  Required.
       @param enablePan Boolean enable or disable panning (default enabled)
       @param enableZoom Boolean enable or disable zooming (default enabled)
       @param enableDrag Boolean enable or disable dragging (default disabled)
       @param zoomScale Float zoom sensitivity, defaults to .2
    **/
    $.fn.svgPan = function (obj, enablePan, enableZoom, enableDrag, zoomScale) {
        enablePan = typeof enablePan !== 'undefined' ? enablePan : true;
        enableZoom = typeof enableZoom !== 'undefined' ? enableZoom : true;
        enableDrag = typeof enableDrag !== 'undefined' ? enableDrag : false;
        zoomScale = typeof zoomScale !== 'undefined' ? zoomScale : 0.2;

        return $.each(this, function (i, el) {
            var $el = $(el),
                svg,
                viewport;
            // only call upon elements that are SVGs and haven't already been initialized.
            if ($el.is('svg') && $el.data('SVGPan') !== true) {
                viewport = $el.find('#' + obj.viewportId)[0];
                if (viewport) {
                    init($el[0], viewport, enablePan, enableZoom, enableDrag, zoomScale, obj);
                } else {
                    throw "Could not find viewport with id #" + viewport;
                }
            }
        });
    };
}));