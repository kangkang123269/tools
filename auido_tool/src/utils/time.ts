export function formatSeconds(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    let result = "";
    if (hours > 0) {
      result += hours.toString().padStart(2, "0") + ":"; // 将小时数格式化为两位数，并在其后添加冒号
    }
    result += minutes.toString().padStart(2, "0") + ":"; // 将分钟数格式化为两位数，并在其后添加冒号
    result += (parseInt(remainingSeconds + '')).toString().padStart(2, "0"); // 将剩余的秒数格式化为两位数
    return result; // 返回结果字符串
  }