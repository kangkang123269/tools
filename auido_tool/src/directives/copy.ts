// directives/copy.js
import { ElMessage } from 'element-plus'

export default {
  mounted(el: any, binding: any) {
    el._copyValue = binding.value;
    el.addEventListener('click', () => {
      // 创建一个隐藏的文本区域
      const textarea = document.createElement('textarea');
      textarea.value = el._copyValue;
      document.body.appendChild(textarea);

      // 选择并复制文本
      textarea.select();
      try {
        document.execCommand('copy');
        ElMessage({
          message: '复制成功',
          type: 'success',
          plain: true,
        })
      } catch (err) {
        ElMessage({
          message: '复制失败',
          type: 'error',
          plain: true,
        })
      }
      // 移除文本区域
      document.body.removeChild(textarea);
    });
  },
  updated(el: any, binding: any) {
    // 更新指令的值
    el._copyValue = binding.value;
    console.log('update', binding.value);
  },
  unmounted(el: any) {
    el.removeEventListener('click', null);
  }
};
