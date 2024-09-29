<script setup lang="ts">
import { Http } from "./http/index";
import { ref, onMounted, watch, computed } from "vue";
import { formatSeconds } from "./utils/time";

const audio = new Audio();

const played = ref<boolean>(false);

interface MuisicDataType {
  artistsname: string;
  name: string;
  picurl: string;
  url: string;
}

const data = ref<MuisicDataType>({});
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

const play = () => {
  audio.play();
  played.value = true;
};

const pause = () => {
  audio.pause();
  played.value = false;
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

const next = () => {
  getData().then(() => {
    play();
  });
}

onMounted(() => {
  getData();
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
    <img :src="data.picurl" alt="" />
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
      <div class="btn" @click="played ? pause() : play()">
        {{ played ? "暂停" : "播放" }}
      </div>
      <div class="line"></div>
      <div class="btn" @click="next">下一首</div>
    </div>
  </div>
</template>

<style>
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
img {
  position: absolute;
  left: 0;
  top: 0;
  /* 
 bottom: 0;
 margin: auto; */
  /* z-index: -1; */
  width: 100vw;
  /* height: 100vh; */
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
  width: 200px;
  /* left: 20%; */
  margin: auto;
  text-align: center;
  border: 1px solid #fff;
  height: 100px;
  line-height: 50px;
}
.line {
  width: 100%;
  height: 1px;
  background: #fff;
}
</style>