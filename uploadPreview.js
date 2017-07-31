/*
    uploadPreview.js
    @author Vic 
    https://github.com/yijian002/js.uploadPreview
*/

;
(function(factory, window) {
        if (typeof define === 'function' && define.amd) {
            define('uploadPreview', factory);
        } else {
            window.uploadPreview = factory();
        }
    }
    (function() {

        'use strict';

        var settings = {
            label_field: '',
            preview: '',
            img_type: ['gif', 'jpeg', 'jpg', 'png'],
            callback: function() {},
            errorback: function() {}
        };

        var preview = null;

        function log(msg) {
            if (window.console && window.console.error) {
                window.console.error(msg);
            } else if (window.opera && window.opera.postError) {
                window.opera.postError(msg);
            }
        }

        function extend(target, source) {
            for (var p in source) {
                if (source.hasOwnProperty(p)) {
                    target[p] = source[p];
                }
            }

            return target;
        }

        function getFilePath(file) {
            var path = null;

            if (window.createObjectURL) {
                path = window.createObjectURL(file);
            } else if (window.URL) {
                path = window.URL.createObjectURL(file);
            } else if (window.webkitURL) {
                path = window.webkitURL.createObjectURL(file);
            }

            return path;
        }

        function addEventHandler(target, type, handler) {
            if (window.addEventListener) {
                target.addEventListener(type, handler, false);
            } else {
                target['on' + type] = handler;
            }
        }

        function getElement(el) {
            return typeof el === 'string' ? document.getElementById(el) : el;
        }

        function errorCallback(msg) {
            settings.errorback(false);
            log(msg);
        }

        function showImg(src) {
            if(preview.tagName === 'IMG') {
                preview.src = src;
            }
            else {
                preview.style.backgroundImage = 'url(' + src + ')';
                preview.style.backgroundSize = 'cover';
                preview.style.backgroundPosition = 'center center'; 
            }
        }

        var uploadPreview = function(opts) {
            if (opts && typeof opts === 'object') {
                extend(settings, opts);
            }

            preview = getElement(settings.preview);
            if (!preview) {
                log('Not found the option preview');
                return;
            }

            var label_field = getElement(settings.label_field);
            if (!label_field) {
                log('Not found the option label_field');
                return;
            }

            addEventHandler(label_field, 'change', function(event) {
                if (!this.value) {
                    errorCallback('Not found the value');
                    return false;
                }

                if (!RegExp('\.(' + settings.img_type.join('|') + ')$', 'i').test(this.value.toLowerCase())) {
                    errorCallback('This file type is not supported');
                    return false;
                }

                if (window.File && window.FileList && window.FileReader) {
                    var files = this.files;
                    if (!files || !files.length) {
                        errorCallback('Not found the files');
                        return false;
                    }

                    var input = event.target,
                        reader = new FileReader();

                    reader.onload = function() {
                        showImg(reader.result);
                    };
                    reader.readAsDataURL(input.files[0]);

                } else {
                    try {
                        var img_path = getFilePath(this.files[0]);
                        showImg(img_path);
                    } catch (e) {
                        this.select();
                        var flie_src = document.selection.createRange().text;
                        document.selection.empty();

                        preview.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)';
                        preview.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = flie_src;
                    }
                }

                if (typeof settings.callback === 'function') {
                    settings.callback();
                }
            });

        };

        return uploadPreview;

    }, window));
