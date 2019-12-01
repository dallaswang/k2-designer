export * from "./queryDesc";

export function joinUrl(baseUrl: string, url: string) {
  if (/^(?:[a-z]+:)?\/\//i.test(url)) {
    return url;
  }

  let joined = [baseUrl, url].join('/');

  let normalize = function (str) {
    return str
      .replace(/[\/]+/g, '/')
      .replace(/\/\?/g, '?')
      .replace(/\/\#/g, '#')
      .replace(/\:\//g, '://');
  };

  return normalize(joined);
}

export function blobConstruct(blobParts?: any, mimeType?) {
  var blob
  var safeMimeType = blobSafeMimeType(mimeType)
  try {
    blob = new Blob(blobParts, { type: safeMimeType })
  } catch (e) {
    //var bb = new BlobBuilder
    //angular.forEach(blobParts, function (blobPart) {
    //  bb.append(blobPart)
    //})
    //blob = bb.getBlob(safeMimeType)
  }
  return blob
}

export function blobSafeMimeType(mimeType) {
  if ([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/ogg',
    'audio/mpeg',
    'audio/mp4',
  ].indexOf(mimeType) == -1) {
    return 'application/octet-stream'
  }
  return mimeType
}

export function bytesToArrayBuffer(b) {
  return (new Uint8Array(b)).buffer;
}

export function bytesToBase64(bytes) {
  var mod3
  var result = ''

  for (var nLen = bytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
    mod3 = nIdx % 3
    nUint24 |= bytes[nIdx] << (16 >>> mod3 & 24)
    if (mod3 === 2 || nLen - nIdx === 1) {
      result += String.fromCharCode(
        uint6ToBase64(nUint24 >>> 18 & 63),
        uint6ToBase64(nUint24 >>> 12 & 63),
        uint6ToBase64(nUint24 >>> 6 & 63),
        uint6ToBase64(nUint24 & 63)
      )
      nUint24 = 0
    }
  }

  return result.replace(/A(?=A$|$)/g, '=')
}

export function uint6ToBase64(nUint6) {
  return nUint6 < 26
    ? nUint6 + 65
    : nUint6 < 52
      ? nUint6 + 71
      : nUint6 < 62
        ? nUint6 - 4
        : nUint6 === 62
          ? 43
          : nUint6 === 63
            ? 47
            : 65
}

export function base64ToBlob(base64str, mimeType) {
  var sliceSize = 1024
  var byteCharacters = atob(base64str)
  var bytesLength = byteCharacters.length
  var slicesCount = Math.ceil(bytesLength / sliceSize)
  var byteArrays = new Array(slicesCount)

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize
    var end = Math.min(begin + sliceSize, bytesLength)

    var bytes = new Array(end - begin)
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0)
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes)
  }

  return blobConstruct(byteArrays, mimeType)
}

export function dataUrlToBlob(url) {
  // var name = 'b64blob ' + url.length
  // console.time(name)
  var urlParts = url.split(',')
  var base64str = urlParts[1]
  var mimeType = urlParts[0].split(':')[1].split(';')[0]
  var blob = base64ToBlob(base64str, mimeType)
  // console.timeEnd(name)
  return blob
}

export function tsNow(seconds?): number {
  var t = +new Date();// + (window.tsOffset || 0)
  return seconds ? Math.floor(t / 1000) : t
}

export function getRichValue(field) {
  if (!field) {
    return ''
  }
  var lines = []
  var line = []

  getRichElementValue(field, lines, line)
  if (line.length) {
    lines.push(line.join(''))
  }

  var value = lines.join('\n')
  value = value.replace(/\u00A0/g, ' ').trim();

  return value
}

export function getRichElementValue(node, lines, line, selNode?, selOffset?) {
  if (node.nodeType == 3) { // TEXT
    if (selNode === node) {
      var value = node.nodeValue
      line.push(value.substr(0, selOffset) + '\x01' + value.substr(selOffset))
    } else {
      line.push(node.nodeValue)
    }
    return
  }
  if (node.nodeType != 1) { // NON-ELEMENT
    return
  }
  var isSelected = (selNode === node)
  var isBlock = node.tagName == 'DIV' || node.tagName == 'P'
  if (isBlock && line.length || node.tagName == 'BR') {
    lines.push(line.join(''))
    line.splice(0, line.length)
  }
  else if (node.tagName == 'IMG') {
    if (node.alt) {
      line.push(node.alt)
    }
  }
  if (isSelected && !selOffset) {
    line.push('\x01')
  }
  var curChild = node.firstChild
  while (curChild) {
    getRichElementValue(curChild, lines, line, selNode, selOffset)
    curChild = curChild.nextSibling
  }
  if (isSelected && selOffset) {
    line.push('\x01')
  }
  if (isBlock && line.length) {
    lines.push(line.join(''))
    line.splice(0, line.length)
  }
}

export function cancelEvent(event) {
  event = event || window.event
  if (event) {
    event = event.originalEvent || event

    if (event.stopPropagation) event.stopPropagation()
    if (event.preventDefault) event.preventDefault()
    event.returnValue = false
    event.cancelBubble = true
  }

  return false
}

//http://en.wikipedia.org/wiki/Seven_dirty_words
const profanities = ['shit', 'piss', 'fuck', 'cunt', 'cocksucker', 'motherfucker'];//, 'tits'];

export function hasProfanities(content: string) {
  var contentCharacter = content.replace(/[^A-Za-z0-9]+/g, '').toLowerCase();
  for (var i = 0; i < profanities.length; i++) {
    if (contentCharacter.indexOf(profanities[i]) > -1) {
      //console.log('Has profanities');
      return true;
    }
  }
  return false;
}
