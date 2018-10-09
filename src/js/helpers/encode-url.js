export default (text, ...other) => encodeURIComponent(`${text}${other.slice(0, -1).join('')}`);
