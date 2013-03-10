(function ($) {

    var insertAfter = function (referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

    var positionCursor = function (element, tag, setBefore) {
        element.focus();
        var range = document.createRange();
        var sel = window.getSelection();
        var i = Array.prototype.indexOf.call(element.childNodes, tag);
        range.setStart(element, setBefore ? i : i + 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return range;
    };

    var tagFromKey = function (element, tags, key) {
        var newTag = document.createElement('hr');
        newTag.setAttribute('data-key', key.replace('"', '&quot;'));
        newTag.setAttribute('data-val', tags[key].replace('"', '&quot;'));
        newTag.setAttribute('draggable', 'true');
        newTag.onresizestart = function () {
            return false;
        };

        newTag.ondragstart = function (e) {
            this.style.opacity = 0.3;
            var childIndex = Array.prototype.indexOf.call(element.childNodes, this);
            e.dataTransfer.setData('Text', childIndex.toString());
        };
        newTag.ondragend = function (e) {
            this.style.opacity = 1;
        };
        newTag.onmousedown = function (e) {
            var ratio = (e.clientX - this.offsetLeft) / this.offsetWidth;
            positionCursor(element, this, ratio < 0.5);
        };
        return newTag;
    };

    var parse = function (element) {
        var previewTxt = '';
        for (var i = 0; i < element.childNodes.length; i++) {
            var child = element.childNodes[i];
            if (child.nodeType === 3)
                previewTxt += child.textContent;
            else
                previewTxt += child.getAttribute('data-key') || '';
        }

        return previewTxt;
    };

    var insertTag = function (element, tag, location) {

        if (typeof location === 'undefined')
            element.appendChild(tag);

        else if ('endContainer' in location) {
            if (location.endContainer !== element) {
                if (location.endOffset > 0)
                    location.endContainer.splitText(location.endOffset);
                insertAfter(location.endContainer, tag);
            }
            else {
                if (location.endOffset >= location.endContainer.childNodes.length)
                    location.endContainer.appendChild(tag);
                else {
                    var referenceNode = location.endContainer.childNodes[location.endOffset];
                    referenceNode.parentNode.insertBefore(tag, referenceNode);
                }
            }
        }

        else
            insertAfter(location, tag);

        return tag;
    };

    var processRawKeys = function (element, tags) {

        var tag = null;

        for (var key in tags) {
            childrenLoop: for (var i = 0; i < element.childNodes.length; i++) {
                var child = element.childNodes[i];
                if (child.nodeType === 3) {
                    for (var key in tags) {
                        var keyIndex = child.textContent.indexOf(key);
                        if (keyIndex != -1) {
                            var afterNode = child;
                            if (keyIndex > 0 || child.textContent.length > key.length)
                                afterNode = child.splitText(keyIndex);
                            tag = insertTag(element, tagFromKey(element, tags, key), child);
                            if (afterNode.textContent.length > key.length)
                                afterNode.textContent = afterNode.textContent.substr(key.length);
                            else
                                element.removeChild(afterNode);
                            continue childrenLoop;
                        }
                    }
                }
            }
        }
        return tag;
    };

    //function taken from http://stackoverflow.com/a/13789789/794962
    var betaNodeFromPoint = function (x, y) {
        var el = document.elementFromPoint(x, y);
        var nodes = el.childNodes;
        for (var i = 0, n; n = nodes[i++];) {
            if (n.nodeType === 3) {
                var r = document.createRange();
                r.selectNode(n);
                var rects = r.getClientRects();
                for (var j = 0, rect; rect = rects[j++];) {
                    if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom)
                        return n;
                }
            }
        }
        return el;
    };

    var setupEvents = function (element, options) {
        var range;

        if (options.menu !== null) {
            options.menu.each(function () {
                var menuItem = $(this);

                menuItem.click(function () {
                    var tag = insertTag(element, tagFromKey(element, options.tags, menuItem.data('key')), range);
                    range = positionCursor(element, tag);
                });
                this.ondragstart = function (e) {
                    e.dataTransfer.setData('Text', menuItem.data('key'));
                };
                this.setAttribute('draggable', 'true');
            });
        }

        element.ondragover = function (e) {

            var node = betaNodeFromPoint(e.clientX, e.clientY);
            range = document.createRange();

            if (node.nodeType === 3) {
                var sizeRange = document.createRange();
                sizeRange.selectNodeContents(node);
                var rect = sizeRange.getBoundingClientRect();
                var ratio = (e.clientX - rect.left) / (rect.right - rect.left);
                var index = Math.round(ratio * (node.textContent.length));
                range.setStart(node, index);
            }
            else if (node !== element) {
                var ratio = (e.clientX - node.offsetLeft) / node.offsetWidth;
                var i = Array.prototype.indexOf.call(element.childNodes, node);
                range.setStart(element, ratio < 0.5 ? i : i + 1);
            }
            else {
                range.setStart(element, element.childNodes.length);
            }

            range.collapse(true);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        };

        element.ondrop = function (e) {
            e.preventDefault();
            var draggedTag;
            var data = e.dataTransfer.getData("Text");
            if (data in options.tags) {
                draggedTag = tagFromKey(element, options.tags, data);
            }
            else {
                draggedTag = element.childNodes[parseInt(data)];
            }
            insertTag(element, draggedTag, range);
            positionCursor(element, draggedTag);
        };

        element.onkeypress = function (e) {
            if (e.keyCode === 10 || e.keyCode === 13)
                return false;
        };

        element.onkeyup = function () {
            if (options.liveRender){
                var tag = processRawKeys(element, options.tags);
                if (tag !== null){
                    range = positionCursor(element, tag);
                    return;
                }
            }
            range = window.getSelection().getRangeAt(0);
        };

        element.onmouseup = function () {
            if (options.liveRender){
                var tag = processRawKeys(element, options.tags);
                if (tag !== null){
                    range = positionCursor(element, tag);
                    return;
                }
            }
            range = window.getSelection().getRangeAt(0);
        };


        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isFirefox) {

            var triggerChangeEvent = function(){
                var evt = document.createEvent("MutationEvent");
                evt.initMutationEvent('DOMNodeRemoved', true, false, element, null, null, null, null);
                element.dispatchEvent(evt);
            };

            element.onkeydown = function (e) {

                switch (e.keyCode) {
                    case 8: //backspace
                    case 37: //left
                        var ff = window.getSelection().getRangeAt(0);
                        var prevTag = null;

                        if (ff.endOffset === 0)
                            prevTag = ff.endContainer.previousSibling;

                        else if (ff.endContainer === element) {
                            prevTag = element.childNodes[ff.endOffset - 1];
                            if (prevTag.nodeType === 3) {
                                if (prevTag.textContent === "") {
                                    var deadTag = prevTag;
                                    prevTag = prevTag.previousSibling;
                                    element.removeChild(deadTag);
                                }
                                else if (e.keyCode === 8 && prevTag.textContent.substr(prevTag.textContent.length - 1) === ' ') {
                                    prevTag.textContent = prevTag.textContent.substr(0, prevTag.textContent.length - 1);
                                    e.preventDefault();
                                    triggerChangeEvent();
                                    return false;
                                }
                                else {
                                    var range = document.createRange();
                                    var sel = window.getSelection();
                                    range.setStart(prevTag, prevTag.length - 1);
                                    range.collapse(true);
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                    e.preventDefault();
                                    triggerChangeEvent();
                                    return false;
                                }

                            }

                        }

                        if (prevTag !== null && 'tagName' in prevTag) {
                            positionCursor(element, prevTag, true);
                            if (e.keyCode === 8){
                                element.removeChild(prevTag);
                                triggerChangeEvent();
                            }
                            return false;
                        }

                        break;
                    case 46: //delete
                    case 39: //right
                        var ff = window.getSelection().getRangeAt(0);
                        var prevTag = null;

                        if (ff.endContainer.nodeType === 3 && ff.endContainer.textContent.length === ff.endOffset) {
                            prevTag = ff.endContainer.nextSibling;
                        }
                        else if (ff.endContainer === element) {
                            if (ff.endOffset === 0)
                                prevTag = element.childNodes[0];
                            else
                                prevTag = element.childNodes[ff.endOffset];
                        }

                        if (prevTag !== null && 'tagName' in prevTag) {
                            positionCursor(element, prevTag);
                            if (e.keyCode === 46){
                                element.removeChild(prevTag);
                                triggerChangeEvent();
                            }
                            return false;
                        }
                        break;
                }
            };
        }
    };

    var setupOnChange = function (element, options) {

        var lastParse = '';
        var liveParse = function () {
            var newParse = parse(element);
            if (lastParse !== newParse) {
                lastParse = newParse;
                options.change(newParse);
            }
        };

        element.addEventListener("input", liveParse, false);
        element.addEventListener("DOMNodeInserted", liveParse, false);
        element.addEventListener("DOMNodeRemoved", liveParse, false);
        element.addEventListener("DOMCharacterDataModified", liveParse, false);

    };

    var methods = {
        init: function (options) {
            this.addClass('dirtyText');
            this.attr('contentEditable', 'true');
            this.data('tags', options.tags);
            if (options.text)
                this.text(options.text);
            setupEvents(this.get(0), options);
            processRawKeys(this.get(0), options.tags);

            if (options.change){
                setupOnChange(this.get(0), options);
                options.change(parse(this.get(0)));
            }

            return this;
        },
        render: function(){
            processRawKeys(this.get(0), this.data('tags'));
            return this;
        },
        parse: function () {
            return parse(this.get(0));
        },
        clear: function(){
            this.html('');
            return this;
        },
        set: function(text){
            this.text(text);
            processRawKeys(this.get(0), this.data('tags'));
            return this;
        }
    };

    var defaultOptions = {
        tags: {},
        liveRender: true,
        change: null,
        menu: null,
        text: ''
    };

    $.fn.dirtyText = function (method, options) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            var options = $.extend(defaultOptions, method);
            return methods.init.apply(this, [options]);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.dirtText');
        }
    };

    $(function () {
      /*@cc_on
        @if (@_jscript_version >= 10)
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = '.dirtyText > *{ vertical-align: middle; }';
        document.body.appendChild(css);
        @end
        @*/
    });

})(jQuery);

