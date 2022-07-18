class Util {

    static rgbaToHex(rgba) {
        var rgb = rgba.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
        return rgb ?
            (rgb[1] | 1 << 8).toString(16).slice(1) +
            (rgb[2] | 1 << 8).toString(16).slice(1) +
            (rgb[3] | 1 << 8).toString(16).slice(1) : rgba;
    };

    static hexToRgba(hex, opacity) {
        hex = hex.replace(/#/g, '');
        if (hex.length === 3) {
            hex = hex.split('').map(function (hex) {
                return hex + hex;
            }).join('');
        }
        opacity = opacity === void 0 ? 1 : opacity;
        var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(hex);
        if (!result) {
            return null;
        }
        var red = parseInt(result[1], 16);
        var green = parseInt(result[2], 16);
        var blue = parseInt(result[3], 16);

        return [red, green, blue, opacity];
    }

    static delayedFunction(fn, duration) {
        let timer
        return function () {
            clearTimeout(timer)
            timer = setTimeout(fn, duration)
        }
    }

    static createImageWithClass(src, ...classNames) {
        let img = document.createElement("img")
        img.src = src
        for (let className of classNames) {
            img.classList.add(className)
        }
        return img
    }

    static hideElement(element) {
        if (element != undefined) {
            element.style.display = "none"
        }
    }

    static hideElements(...elements) {
        for (let element of elements) {
            if (element != undefined) {
                element.style.display = "none"
            }
        }
    }

    static showElement(element, display = "block") {
        if (element != undefined) {
            element.style.display = display
        }
    }

    static showElements(...elements) {
        for (let element of elements) {
            Util.showElement(element)
        }
    }

    static toggleElement(element) {
        if (element.style.display !== 'none') {
            Util.hideElements(element)
            return true
        }
        Util.showElement(element)
    }

    static clearElements(...elements) {
        for (let element of elements) {
            if (element != undefined) {
                element.innerHTML = ""
            }
        }
    }

    static clearValues(...elements) {
        for (let element of elements) {
            if (element != undefined || element != null) {
                element.value = ''
            }
        }
    }

    static hasActive(elements) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i] != undefined && elements[i].classList.contains('active')) {
                return true
                break
            }
        }
        return false
    }

    static deActivate(...activeElements) {
        for (let elements of activeElements) {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i] != undefined && elements[i].classList.contains('active')) {
                    elements[i].classList.remove('active')
                }
            }
        }
    }

    static setElementsActive(...deActiveElements) {
        for (let elements of deActiveElements) {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i] != undefined && elements[i].classList.contains('active') !== true) {
                    elements[i].classList.add('active')
                }
            }
        }
    }

    static elementsLabel(element) {
        let labels = document.getElementsByTagName('label');
        for (let i = 0; i < labels.length; i++) {
            if (labels[i].htmlFor === element.id) {
                return labels[i];
            }
        }
    }

    static flashValidationError(errorElement, message, milliSeconds = 4000) {
        errorElement.innerHTML = message

        setTimeout(function () {
            Util.clearElements(errorElement)
        }, milliSeconds)
    }

    static getParentsAttribute(element, attribute) {
        try {
            let currentParentElement = element.parentElement
            while (!currentParentElement.getAttribute(attribute)) {
                currentParentElement = currentParentElement.parentElement
            }

            return currentParentElement.getAttribute(attribute)
        } catch (e) {
            //console.log(`Please Define The Atribute : ${attribute} You Want In The Parent Element`)

            return null
        }
    }

    static isImage(element) {
        if (element != undefined && element instanceof HTMLImageElement) {
            return element.nodeName.toLowerCase() === 'img';
        }

        return false
    }

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static swapNodes(n1, n2) {

        const p1 = n1.parentNode;
        const p2 = n2.parentNode;
        let i1, i2;

        if ( !p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1) ) return;

        for (let i = 0; i < p1.children.length; i++) {
            if (p1.children[i].isEqualNode(n1)) {
                i1 = i;
            }
        }
        for (let i = 0; i < p2.children.length; i++) {
            if (p2.children[i].isEqualNode(n2)) {
                i2 = i;
            }
        }
        if ( p1.isEqualNode(p2) && i1 < i2 ) {
            i2++;
        }
        p1.insertBefore(n2, p1.children[i1]);
        p2.insertBefore(n1, p2.children[i2]);
    }

    static debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
	
	static throttle(func, delay) {
        let lastCalled = 0;
        return (...args) => {
            let now = new Date().getTime();
            if(now - lastCalled < delay) {
                return;
            }
            lastCalled = now;
            return func(...args);
        }
    }

    static checkParent(parent, child) {
        let node = child.parentNode;
        // keep iterating unless null
        if (node == parent) {
            return true;
        }
        return false;
    }

    static getCSFRToken() {
        const csrf_token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        if (csrf_token){
            return csrf_token;
        }
    }

    static getVisitorToken() {
        const token = document.querySelector("meta[name='visitor-token']").getAttribute("content");
        if (token){
            return token;
        }
    }

    static isMobileDevice() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true
        } else {
            return false
        }
    }
	
	static elementInViewport(el) {
        let top = el.offsetTop;
        let left = el.offsetLeft;
        const width = el.offsetWidth;
        const height = el.offsetHeight;

        while(el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top < (window.pageYOffset + window.innerHeight) &&
            left < (window.pageXOffset + window.innerWidth) &&
            (top + height) > window.pageYOffset &&
            (left + width) > window.pageXOffset
        );
    }
	
	static decimalPlaces(num) {
        const match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) { return 0; }
        return Math.max(
            0,
            // Number of digits right of decimal point.
            (match[1] ? match[1].length : 0)
            // Adjust for scientific notation.
            - (match[2] ? +match[2] : 0));
    }
}
