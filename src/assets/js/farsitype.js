var FarsiType = {
    // Farsi keyboard map based on Iran Popular Keyboard Layout
    farsiKey: [
		32, 33, 34, 35, 36, 37, 1548, 1711,
		41, 40, 215, 43, 1608, 45, 46, 47,
		48, 49, 50, 51, 52, 53, 54, 55,
		56, 57, 58, 1603, 44, 61, 46, 1567,
		64, 1616, 1584, 125, 1610, 1615, 1610, 1604,
		1570, 247, 1600, 1548, 47, 8217, 1583, 215,
		1563, 1614, 1569, 1613, 1601, 8216, 123, 1611,
		1618, 1573, 126, 1580, 1688, 1670, 94, 95,
		1662, 1588, 1584, 1586, 1610, 1579, 1576, 1604,
		1575, 1607, 1578, 1606, 1605, 1574, 1583, 1582,
		1581, 1590, 1602, 1587, 1601, 1593, 1585, 1589,
		1591, 1594, 1592, 60, 124, 62, 1617
	],
    Type: true,
    counter: 0,
    ShowChangeLangButton: 0, // 0: Hidden / 1: Visible
    KeyBoardError: 0, 		// 0: Disable FarsiType / 1: Show Error
    ChangeDir: 0, 		// 0: No Action / 1: Do Rtl-Ltr / 2: Rtl-Ltr button
    UnSupportedAction: 0		//0: Disable FarsiType / 1: Low Support
}

FarsiType.enable_disable = function (Dis) {
    var invis, obj;

    if (!Dis.checked) {
        FarsiType.Type = true;
        disable = false;
        color = 'darkblue';
    } else {
        FarsiType.Type = false;
        disable = true;
        color = '#ECE9D8';
    }

    if (FarsiType.ShowChangeLangButton == 1) {
        for (var i = 1; i <= FarsiType.counter; i++) {
            obj = document.getElementById('FarsiType_button_' + i);
            obj.disabled = disable;
            obj.style.backgroundColor = color;
        }
    }
}

FarsiType.Disable = function () {
    FarsiType.Type = false;
    var Dis = document.getElementById('disableFarsiType')
    if (Dis != null) {
        Dis.checked = true;
    }

    if (FarsiType.ShowChangeLangButton == 1) {
        for (var i = 1; i <= FarsiType.counter; i++) {
            obj = document.getElementById('FarsiType_button_' + i);
            obj.disabled = true;
            obj.style.backgroundColor = '#ECE9D8';
        }
    }
}

FarsiType.isWritable = function (el) {
    if ((el.readOnly || el.readOnly == "readonly") || (el.disabled || el.disabled == "disabled")) {
        return false;
    } else {
        return true;
    }
}

FarsiType.init = function (el) {
    var containerEl = ((typeof (el) != 'undefined' && el) ? el : document);
    var Inputs = containerEl.getElementsByTagName('INPUT');
    for (var i = 0; i < Inputs.length; i++) {
        if (Inputs[i].type.toLowerCase() == 'text' && FarsiType.isWritable(Inputs[i]) &&
            (typeof Inputs[i].lang == 'undefined' || Inputs[i].lang == null || Inputs[i].lang == ''
             || Inputs[i].lang.toLowerCase() == 'fa' || Inputs[i].lang.toLowerCase() == 'fa-ir')) {
            FarsiType.counter++;
            new FarsiType.KeyObject(Inputs[i], FarsiType.counter);
        }
    }

    var Areas = containerEl.getElementsByTagName('TEXTAREA');
    for (var i = 0; i < Areas.length; i++) {
        if (FarsiType.isWritable(Areas[i]) && (typeof Areas[i].lang == 'undefined' || Areas[i].lang == null || Areas[i].lang == ''
            || Areas[i].lang.toLowerCase() == 'fa' || Areas[i].lang.toLowerCase() == 'fa-ir')) {
            FarsiType.counter++;
            new FarsiType.KeyObject(Areas[i], FarsiType.counter);
        }
    }

    var sels = containerEl.getElementsByTagName('SELECT');
    for (var i = 0; i < sels.length; i++) {
        if (FarsiType.isWritable(sels[i]) && (typeof sels[i].lang == 'undefined' || sels[i].lang == null || sels[i].lang == ''
            || sels[i].lang.toLowerCase() == 'fa' || sels[i].lang.toLowerCase() == 'fa-ir')) {
            FarsiType.counter++;
            new FarsiType.KeyObject(sels[i], FarsiType.counter);
        }
    }

    var Dis = document.getElementById('disableFarsiType')
    if (Dis != null) {
        FarsiType.enable_disable(Dis);
        Dis.onclick = new Function("FarsiType.enable_disable (this);")
    }
}

FarsiType.KeyObject = function (z, x) {

    z.farsi = true;
    z.dir = "rtl";
    z.align = "right";

    z.style.textAlign = z.align;
    z.style.direction = z.dir;

    setSelectionRange = function (input, selectionStart, selectionEnd) {
        input.focus()
        input.setSelectionRange(selectionStart, selectionEnd)
    }

    ChangeDirection = function () {
        if (z.dir == "rtl") {
            z.dir = "ltr";
            z.align = "left";
            z.Direlm.value = "LTR";
            z.Direlm.title = "Change direction: Right to Left"
        } else {
            z.dir = "rtl";
            z.align = "right";
            z.Direlm.value = "RTL";
            z.Direlm.title = "Change direction: Left to Right"
        }
        z.style.textAlign = z.align;
        z.style.direction = z.dir;
        z.focus();
    }

    ChangeLang = function (e, ze) {
        if (ze)
            z = ze;

        if (FarsiType.Type) {
            if (z.farsi) {
                z.farsi = false;
                if (FarsiType.ShowChangeLangButton == 1) {
                    z.bottelm.value = "EN";
                    z.bottelm.title = 'Change lang to persian';
                }
                if (FarsiType.ChangeDir == 1) {
                    z.style.textAlign = "left";
                    z.style.direction = "ltr";
                }
            } else {
                z.farsi = true;
                if (FarsiType.ShowChangeLangButton == 1) {
                    z.bottelm.value = "FA";
                    z.bottelm.title = 'Change lang to english';
                }
                if (FarsiType.ChangeDir == 1) {
                    z.style.textAlign = "right";
                    z.style.direction = "rtl";
                }
            }
            z.focus();
        }

        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
        return false;
    }

    Convert = function (e) {

        if (e == null)
            e = window.event;

        var key = e.which || e.charCode || e.keyCode;
        var rkey = key;
        var eElement = e.target || e.originalTarget || e.srcElement;

        if (e.ctrlKey && key == 32) {
            ChangeLang(e, z);
        }

        if (FarsiType.Type) {
            if (
				(e.charCode != null && e.charCode != key) ||
				(e.which != null && e.which != key) ||
				(e.ctrlKey || e.altKey || e.metaKey) ||
				(key == 13 || key == 27 || key == 8)
			) return true;

            //check windows lang
            if (key > 128) {
                if (FarsiType.KeyBoardError == 0) {
                    FarsiType.Disable();
                } else {
                    alert("لطفا زبان سیستم را به انگیلیسی تغییر دهید");
                    return false;
                }
            }

            // If Farsi
            if (FarsiType.Type && z.farsi) {

                //check CpasLock
                if ((key >= 65 && key <= 90 && !e.shiftKey) || (key >= 97 && key <= 122) && e.shiftKey) {
                    alert("لطفا Caps Lock را خاموش نمایید");
                    return false;
                }

                // Shift-space -> ZWNJ
                if (key == 32 && e.shiftKey)
                    rkey = 8204;
                else
                    rkey = FarsiType.farsiKey[key - 32];

                if (rkey != key) {
                    rkey = (typeof rkey == 'string' ? rkey : String.fromCharCode(rkey));
                    return changeKeyCode(e, eElement, rkey);
                }
            }
        }
        return true;
    }

    changeKeyCode = function (e, eElement, key) {

        // to farsi
        try {

            var docSelection = document.selection;
            var selectionStart = eElement.selectionStart;
            var selectionEnd = eElement.selectionEnd;

            if (typeof selectionStart == 'number') {
                //FOR W3C STANDARD BROWSERS
                var nScrollTop = eElement.scrollTop;
                var nScrollLeft = eElement.scrollLeft;
                var nScrollWidth = eElement.scrollWidth;

                eElement.value = eElement.value.substring(0, selectionStart) + key + eElement.value.substring(selectionEnd);
                setSelectionRange(eElement, selectionStart + key.length, selectionStart + key.length);

                var nW = eElement.scrollWidth - nScrollWidth;
                if (eElement.scrollTop == 0) { eElement.scrollTop = nScrollTop }
            } else if (docSelection) {
                var nRange = docSelection.createRange();
                nRange.text = key;
                nRange.setEndPoint('StartToEnd', nRange);
                nRange.select();
            }

        } catch (error) {
            try {
                // IE
                e.keyCode = key
            } catch (error) {
                try {
                    // OLD GECKO
                    e.initKeyEvent("keypress", true, true, document.defaultView, false, false, true, false, 0, key, eElement);
                } catch (error) {
                    //OTHERWISE
                    if (FarsiType.UnSupportedAction == 0) {
                        alert('Sorry! no FarsiType support')
                        FarsiType.Disable();
                        var Dis = document.getElementById('disableFarsiType')
                        if (Dis != null) {
                            Dis.disabled = true;
                        }
                        return false;
                    } else {
                        eElement.value += key;
                    }
                }
            }
        }

        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
        return false;
    }

    standardPersianChar = function (e) {
        if (e == null)
            e = window.event;

        var key = e.which || e.charCode || e.keyCode;
        var eElement = e.target || e.originalTarget || e.srcElement;

        //standard ya, kaf
        if (key == 1705) changeKeyCode(e, eElement, String.fromCharCode(1603));
        else if (key == 1609 || key == 1740) changeKeyCode(e, eElement, String.fromCharCode(1610));
    }

    if (FarsiType.ShowChangeLangButton == 1) { z.bottelm.onmouseup = ChangeLang; }
    if (FarsiType.ChangeDir == 2) { z.Direlm.onmouseup = ChangeDirection; }

    if (z.attachEvent) {
        z.attachEvent("onkeypress", standardPersianChar);
        z.attachEvent("onkeypress", Convert);
    } else if (z.addEventListener) {
        z.addEventListener("keypress", standardPersianChar, false);
        z.addEventListener("keypress", Convert, false);
    }
}


if (typeof (Ext) != 'undefined' && typeof (Ext.onReady) != 'undefined') {
    Ext.onReady(function () { FarsiType.init(); });
} else {
    if (window.attachEvent) {
        window.attachEvent('onload', function () { FarsiType.init(); });
    } else if (window.addEventListener) {
        window.addEventListener('load', function () { FarsiType.init(); }, false);
    }
}
