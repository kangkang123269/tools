<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";

import { Http } from "./http/index";
import { formatSeconds, downloadAudio, encryptedId, getQueryParam } from "./utils";

import down_icon from "@/assets/down.svg"
import play_icon from "@/assets/play.svg"
import pause_icon from "@/assets/pause.svg"
import next_icon from "@/assets/next.svg"

const audio = new Audio();

const played = ref<boolean>(false);

interface MuisicDataType {
  artistsname: string;
  name: string;
  picurl: string;
  url: string;
}

const data = ref<MuisicDataType>({
  artistsname: "",
  name: "",
  picurl: "",
  url: ""
});
const loading = ref(true);

const getData = () => {
  audio.pause();
  loading.value = true;
  return Http.getMusic()
    .then((res) => {
      data.value = res.data;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};

const info = ref({
  duration: 0,
  currentTime: 0,
});

watch(
  () => data.value.url,
  () => {
    if (data.value.url) {
      audio.src = data.value.url;
      audio.preload = "auto";
      audio.addEventListener("loadeddata", () => {
        console.log("duation", audio.duration);
        info.value.duration = audio.duration;
      });
      audio.addEventListener("timeupdate", () => {
        info.value.currentTime = audio.currentTime;
      });
      audio.addEventListener('ended', () => {
        played.value = false;
        getData().then(() => {
          play();
        });
      })
    }
  },
  {
    immediate: true,
  }
);

watch(() => info.value.currentTime, () => {
  if(!played.value) {
    audio.currentTime = info.value.currentTime
  }
})

const durationStr = computed(() => formatSeconds(info.value.duration));
const currentTimeStr = computed(() => formatSeconds(info.value.currentTime));

const formatTooTip = (val: number) => {
  return formatSeconds(val)
}

const change = (val: number) => {
  console.log('val', val);

  played.value = false;
  audio.pause();
  info.value.currentTime = val
}

// 播放
function play() {
  audio.play();
  played.value = true;
};

// 暂停
function pause() {
  audio.pause();
  played.value = false;
};

// 下一首
const next = () => {
  getData().then(() => {
    play();
  });
}

// 下载
const down = () => {
  // 下载音频
  downloadAudio(data.value.url, data.value.name + '-' + data.value.artistsname);
};

onMounted(() => {
  getData();
  audio.addEventListener('progress', () => {
    const buffered = audio.buffered;
    if (buffered.length) {
        const loaded = buffered.end(buffered.length - 1);
        const total = audio.duration;
        console.log(`已加载： ${(loaded / total * 100).toFixed(2)}%`);
    }
  });
});
</script>

<template>
  <div
    class="body"
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(122, 122, 122, 0.8)"
  >
    <img :src="data.picurl" class="picurl" alt="" />
    <div class="info">
      <div>{{ data.name }}</div>
      <div>{{ data.artistsname }}</div>
      <div class="progress">
        <div class="currentTime">{{ currentTimeStr }}</div>
        <el-slider @input="change" v-model="info.currentTime" :max="info.duration" :format-tooltip="formatTooTip" />
        <div class="duration">{{ durationStr }}</div>
      </div>
    </div>

    <div class="btns">
      <img :src="played ? pause_icon : play_icon" @click="played ? pause() : play()" alt="">
      <img :src="next_icon" @click="next" alt="">
      <img :src="down_icon" v-copy="data.url" alt="">
    </div>
  </div>
</template>

<style lang="less">
.progress {
  display: flex;
  align-items: center;
  padding: 10px;
}
.currentTime {
  margin-right: 20px;
}
.duration {
  margin-left: 10px;
}
body {
  padding: 0;
  margin: 0;
}
.body {
  /* margin: 0; */
  position: relative;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
}
.picurl {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
}
audio {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: auto;
  text-align: center;
}
.info {
  position: absolute;
  top: calc(100vw + 10px);
  width: 100%;
  text-align: center;
}
.btns {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  /* left: 20%; */
  width: 80%;
  margin: auto;
  text-align: center;
  display: flex;
  line-height: 50px;
  align-items: center;
  justify-content: space-around;
  img {
    width: 40px;
    height: 40px;
  }
}
.line {
  width: 100%;
  height: 1px;
  background: #fff;
}
</style>