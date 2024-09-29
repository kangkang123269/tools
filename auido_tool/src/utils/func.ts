import CryptoJS from 'crypto-js';

export async function downloadAudio(url: string, filename: string = 'audio.mp3') {
    const response = await fetch(url, {
        method: 'HEAD', // 使用HEAD方法，只获取响应头
        redirect: 'follow' // 跟随重定向
    });

    console.log('response', response);

    const blob = await response.blob();
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = urlBlob;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(urlBlob);
    document.body.removeChild(a);
}

export function encryptedId(id: string): string {
    const key: string = '3go8&$8*3*3h0k(2)2';
    const byte1: Uint8Array = new TextEncoder().encode(key);
    let byte2: Uint8Array = new TextEncoder().encode(id);
    const byte1Len: number = byte1.length;

    // 异或操作
    byte2 = byte2.map((byte, index) => byte ^ byte1[index % byte1Len]);

    // 使用CryptoJS来计算MD5
    const wordArray = CryptoJS.lib.WordArray.create(Array.from(byte2));
    const hash = CryptoJS.MD5(wordArray);

    // 将MD5结果转换为Base64
    let base64: string = CryptoJS.enc.Base64.stringify(hash);
    base64 = base64.replace(/\//g, '_');
    base64 = base64.replace(/\+/g, '-');

    // 移除最后一个Base64填充字符
    return base64.slice(0, -1);
  }

export function getQueryParams(url: string) {
    const queryString = url.split('?')[1];
    const queryParams = {};
    if (queryString) {
        const pairs = queryString.split('&');
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            queryParams[decodeURIComponent(key)] = decodeURIComponent(value);
        }
    }
    return queryParams;
}

export function getQueryParam(url: string, key: string) {
    const params = getQueryParams(url);
    return params[key];
}