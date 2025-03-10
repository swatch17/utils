import isString from 'lodash-es/isString';
import isNumber from 'lodash-es/isNumber';
import isEmpty from 'lodash-es/isEmpty';
import isArray from 'lodash-es/isArray';
import isObject from 'lodash-es/isObject';
import dayjs from 'dayjs';

/**
 * 将给定的字符串解析为 JSON 对象，如果解析失败则返回原字符串
 *
 * @param obj 要解析的字符串
 * @returns 解析后的 JSON 对象或原字符串
 */
export const jsonParse = (obj) => {
  try {
    return JSON.parse(obj);
  } catch (err) {
    return obj;
  }
};

/**
 * 操作 sessionStorage 的工具函数
 *
 * @param aKey sessionStorage 中的键名
 * @param aVal 可选参数，sessionStorage 中的键值。如果不传此参数，则返回对应的键值；如果传了此参数，则将其保存到 sessionStorage 中
 * @returns 如果没有传递 aVal 参数，则返回对应的键值；否则返回 undefined
 */
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

/**
 * 从 sessionStorage 中移除指定键的值
 *
 * @param aKey 要移除的键名
 */
export const sessionRemove = (aKey) => {
  sessionStorage.removeItem(aKey);
};

/**
 * 操作 localStorage 的工具函数
 *
 * @param aKey localStorage 中的键名
 * @param aVal 可选参数，localStorage 中的键值。如果不传此参数，则返回对应的键值；如果传了此参数，则将其保存到 localStorage 中
 * @returns 如果没有传递 aVal 参数，则返回对应的键值；否则返回 undefined
 */
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

/**
 * 从本地存储中移除指定键的值
 *
 * @param aKey 要移除的键
 */
export const localRemove = (aKey) => {
  localStorage.removeItem(aKey);
};

/**
 * 格式化时间 年月日 时分秒
 *
 * @param t 要格式化的时间字符串或Date对象
 * @returns 格式化后的时间字符串
 */
export const formatTime = (t) => {
  return t ? dayjs(t).format('YYYY-MM-DD HH:mm:ss') : undefined;
};

// 格式化日期
/**
 * 格式化日期函数
 *
 * @param date 待格式化的日期字符串或Date对象
 * @param type 日期格式类型，默认为 'date'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date, type = 'date') => {
  if (!date) return ''
  const obj = {
    zero: dayjs(date).format('YYYY-MM-DD 00:00:00'),
    time: dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    date: dayjs(date).format('YYYY-MM-DD'),
    dateCN: dayjs(date).format('YYYY年MM月DD日'),
    yymmdd: dayjs(date).format('YYYYMMDD'),
    year: dayjs(date).format('YYYY'),
    sprit: dayjs(date).format('YYYY/MM/DD')
  }
  return (type && obj[type]) || obj.time
}


/**
 * 格式化数据字典选项
 *
 * @param list 数据字典列表
 * @returns 格式化后的数据字典选项
 */
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

/**
 * 根据code匹配数据字典label
 *
 * @param list 数据字典列表
 * @param code 要匹配的code值
 * @returns 匹配到的数据字典label
 */
export const matchDictLabel = (list, code) => {
  const target = list?.find((item) => item.value === code);
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

/**
 * 获取当前平台的类型信息
 *
 * @returns 返回一个对象，包含以下属性：
 * - mobile: 布尔值，表示是否为移动终端
 * - ios: 布尔值，表示是否为iOS终端
 * - android: 布尔值，表示是否为Android终端或uc浏览器
 * - iPhone: 布尔值，表示是否为iPhone或QQHD浏览器
 * - iPad: 布尔值，表示是否为iPad
 * - webApp: 布尔值，表示是否为web应用程序（没有头部与底部）
 * - isWeiXin: 布尔值，表示是否为微信浏览器
 * - isSafari: 布尔值，表示是否为Safari浏览器（非Chrome和Edge）
 */
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
/**
 * 生成一个指定长度的唯一标识符（UUID）
 *
 * @param len 生成的UUID长度，默认为32。如果未指定或指定为null，则生成标准的UUID格式（36个字符，包含4个短横线）
 * @param radix 用于生成UUID的基数，默认为chars数组的长度。如果未指定，则默认为chars数组的长度
 * @returns 返回生成的UUID字符串
 */
export const generateUuid = (len = 32, radix) => {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
      ''
    );
  const uuid: string[] = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i++)
      uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    let r;

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
};

// 在路径中获取文件格式
export const getFileExt = (path) => {
  if (path) {
    const lastIndex = path.lastIndexOf('.');
    return path.substr(lastIndex + 1);
  }
};

// 判断数据类型
/**
 * 获取对象的类型
 *
 * @param obj 要获取类型的对象
 * @returns 返回对象的类型字符串
 */
export const getType = (obj) => {
  const type = typeof obj;
  if (type !== 'object') {
    //基础数据类型判断ei
    return type;
  }
  return Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase();
};

/**
 * 将数据按月份分组
 * @param {Array} data - 包含日期字段的数据数组
 * @param {string} dateField - 日期字段的名称
 * @returns {Object} - 按月份分组的数据对象
 */
function groupByMonth(data, dateField = 'date') {
  return data.reduce((groups, item) => {
      const date = new Date(item[dateField]);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!groups[monthKey]) {
          groups[monthKey] = [];
      }
      
      groups[monthKey].push(item);
      return groups;
  }, {});
}
