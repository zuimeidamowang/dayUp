import {
	Platform,
	StyleSheet,
	Dimensions,
	ViewStyle,
	TextStyle,
	ImageStyle
} from 'react-native';
// 屏幕宽度
const { width: deviceSize = 750 } = Dimensions.get('window');
// 设计稿宽度
let designWidth = 750;
const setDesignWidth = (value = 750) => {
	designWidth = value;
};

// 正则匹配上的css属性都将用px2dp进行换算
const cssRegulars = [
	/top/,
	/bottom/,
	/left/,
	/right/,
	/^margin/,
	/^padding/,
	/width$/i,
	/height$/i,
	/radius$/i,
	/^translate/,
	/fontSize/
];

const HQ_Screen = deviceSize > 600; // 高清屏 例如折叠屏

// 单位转换
// useDecimals 保留两位有效数字
const px2dp = (px: any, useDecimals?: boolean): any => {
	const unit = useDecimals ? 100 : 1;
	if (typeof px !== 'number') {
		return px;
	} else if (Math.abs(px) <= 1) {
		return px;
	} else {
		if (HQ_Screen) {
			return (
				Math.round(
					parseInt(px + '', 10) * (deviceSize / 2 / designWidth) * unit
				) / unit
			);
		} else {
			return (
				Math.round(parseInt(px + '', 10) * (deviceSize / designWidth) * unit) /
				unit
			);
		}
	}
};

// dp方法转化为系数 使用后需要自行 Math.round
export const dpFactor = HQ_Screen ? (deviceSize / 2 / designWidth) : (deviceSize / designWidth);

// 样式转换
const transformStyles = (val: any, useDecimals: boolean, key?: any): any => {
	if (Array.isArray(val)) {
		const res = [];
		val.forEach((item) => res.push(transformStyles(item, useDecimals, null)));
		return res;
	}

	if (Object.prototype.toString.call(val) === '[object Object]') {
		Object.keys(val).forEach(
			(k) => (val[k] = transformStyles(val[k], useDecimals, k))
		);
	}

	for (const item of cssRegulars) {
		if (item.test(key)) {
			val = px2dp(val, useDecimals);
			break;
		}
	}

	return val;
};

/**
 * 单位转换工具
 */
export const dp = px2dp;

/**
 * 创建样式表
 */
type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/*
  useDecimals 使用小数 更精确的计算尺寸
*/
export function createStyleSheet<T extends NamedStyles<T> | NamedStyles<any>>(
	obj: T | NamedStyles<T>,
	useDecimals?: boolean
): T {
	const preSize = designWidth;
	const styles = transformStyles(obj, useDecimals, null);
	setDesignWidth(preSize);
	return StyleSheet.create(styles);
}

/**
 * 创建适配ios, android, web三端的阴影
 */

interface ShadowProps {
	h?: number;
	v?: number;
	color?: string;
	opacity?: number;
	blur?: number;
	elevation?: number;
}

export function createShadow({
	h = 0,
	v = 0,
	color = '#000',
	opacity = 0.7,
	blur = 1,
	elevation = 2
}: ShadowProps) : any {
	return Platform.select({
		ios: {
			shadowColor: color,
			shadowOpacity: opacity,
			shadowOffset: { width: h, height: v },
			shadowRadius: blur
		},
		android: {
			elevation
		},
		web: {
			shadowColor: color,
			shadowOffset: { width: h, height: v },
			shadowOpacity: opacity,
			shadowRadius: blur
		}
	});
}
