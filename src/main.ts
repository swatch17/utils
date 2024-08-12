import isString from 'lodash-es/isString';
import isNumber from 'lodash-es/isNumber';
import isEmpty from 'lodash-es/isEmpty';
import isArray from 'lodash-es/isArray';
import isObject from 'lodash-es/isObject';
import dayjs from 'dayjs';

export const jsonParse = (obj) => {
  try {
    return JSON.parse(obj);
  } catch (err) {
    return obj;
  }
};

export const session = (aKey, aVal?) => {
  if (typeof aVal === 'undefined') {
    return jsonParse(sessionStorage.getItem(aKey));
  } else {
    sessionStorage.setItem(
      aKey,
      isString(aVal) || isNumber(aVal)
        ? (aVal as any)
        : JSON.stringify(aVal)
    );
  }
};

export const sessionRemove = (aKey) => {
  sessionStorage.removeItem(aKey);
};

export const local = (aKey, aVal?) => {
  if (typeof aVal === 'undefined') {
    return jsonParse(localStorage.getItem(aKey));
  } else {
    localStorage.setItem(
      aKey,
      isString(aVal) || isNumber(aVal)
        ? (aVal as any)
        : JSON.stringify(aVal)
    );
  }
};

export const localRemove = (aKey) => {
  localStorage.removeItem(aKey);
};

// 格式化时间 年月日 时分秒
export const formatTime = (t) => {
  return t ? dayjs(t).format('YYYY-MM-DD HH:mm:ss') : undefined;
};

// 格式化日期
export const formatDate = (t) => {
  return t ? dayjs(t).format('YYYY-MM-DD') : undefined;
};

// 格式化数据字典选项
export const formatDict = (list) => {
  if (!isEmpty(list) && isArray(list)) {
    return list.map((item) => ({
      ...item,
      value: item.id,
      label: item.title || item.name,
      valueList: item?.optionalValue ?? '',
    }));
  }
  return [];
};

// 根据code匹配数据字典label
export const matchDictLabel = (list, code) => {
  const target = list.find((item) => item.value === code);
  return target ? target.label : '';
};

// 对象转数组,用于图表
export const formatObjToArr = (obj) => {
  if (!isEmpty(obj) && isObject(obj)) {
    const arr: any[] = [];
    for (const key in obj) {
      arr.push({
        name: key,
        value: obj[key],
      });
    }
    return arr;
  }
  return [];
};

// 序列化地址数组 "110101001"-->['11','110101','110101001']
export const formatAddr = (str) => {
  if (str && str.length === 9) {
    const firstPart = str.substr(0, 2);
    const secondPart = str.substr(0, 6);
    const thirdPart = str.substr(0, 9);
    return [firstPart, secondPart, thirdPart];
  }
  return [];
};

// 获取文件路径种的文件名
export const getPathFileName = (url) => {
  if (url) {
    const arr = url.split('/');
    return arr[arr.length - 1];
  }
};

// 跳转打开新窗口
export const jumpLink = (url) => {
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  if (url) {
    a.click();
  }
};

export const getPlatform = () => {
  const u = navigator.userAgent;
  return {
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, //是否iPad
    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部,
    isWeiXin: u.indexOf('MicroMessenger') > -1, // 判断是否微信浏览器
    isSafari: /Safari/.test(u) && !/Chrome/.test(u) && !/Edg/.test(u),
  };
};

// 指定长度和基数
export const generateUuid = (len = 32, radix) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid:string[] = []
  let i
  radix = radix || chars.length

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

// 在路径中获取文件格式
export const getFileExt = (path) => {
  if (path) {
    const lastIndex = path.lastIndexOf('.')
    return path.substr(lastIndex + 1)
  }
}
