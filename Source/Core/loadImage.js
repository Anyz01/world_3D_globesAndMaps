/*global define*/
define([
        '../ThirdParty/bluebird',
        './defaultValue',
        './defined',
        './DeveloperError',
        './isCrossOriginUrl'
    ], function(
        Promise,
        defaultValue,
        defined,
        DeveloperError,
        isCrossOriginUrl) {
    'use strict';

    var dataUriRegex = /^data:/;

    /**
     * Asynchronously loads the given image URL.  Returns a promise that will resolve to
     * an {@link Image} once loaded, or reject if the image failed to load.
     *
     * @exports loadImage
     *
     * @param {String|Promise.<String>} url The source of the image, or a promise for the URL.
     * @param {Boolean} [allowCrossOrigin=true] Whether to request the image using Cross-Origin
     *        Resource Sharing (CORS).  CORS is only actually used if the image URL is actually cross-origin.
     *        Data URIs are never requested using CORS.
     * @returns {Promise.<Image>} a promise that will resolve to the requested data when loaded.
     *
     *
     * @example
     * // load a single image asynchronously
     * Cesium.loadImage('some/image/url.png').then(function(image) {
     *     // use the loaded image
     * }).otherwise(function(error) {
     *     // an error occurred
     * });
     *
     * // load several images in parallel
     * when.all([loadImage('image1.png'), loadImage('image2.png')]).then(function(images) {
     *     // images is an array containing all the loaded images
     * });
     *
     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
     */
    function loadImage(url, allowCrossOrigin) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(url)) {
            throw new DeveloperError('url is required.');
        }
        //>>includeEnd('debug');

        allowCrossOrigin = defaultValue(allowCrossOrigin, true);

        function createImage(url) {
            var crossOrigin;

            // data URIs can't have allowCrossOrigin set.
            if (dataUriRegex.test(url) || !allowCrossOrigin) {
                crossOrigin = false;
            } else {
                crossOrigin = isCrossOriginUrl(url);
            }

            return loadImage.createImage(url, crossOrigin);
        }

        if (typeof url.then === 'function') {
            return url.then(createImage);
        }
        return createImage(url);
    }

    // This is broken out into a separate function so that it can be mocked for testing purposes.
    loadImage.createImage = function(url, crossOrigin) {
        return new Promise(function(resolve, reject) {
            var image = new Image();

            image.onload = function() {
                resolve(image);
            };

            image.onerror = reject;

            if (crossOrigin) {
                image.crossOrigin = '';
            }

            image.src = url;
        });
    };

    loadImage.defaultCreateImage = loadImage.createImage;

    return loadImage;
});
