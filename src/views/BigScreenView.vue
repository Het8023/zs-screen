<template>
  <v-scale-screen width="1920" height="1080">
    <div class="all-charts">
      <div class="section-one">
        <img alt="logo" class="img-header"
          src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E6%A6%82%E5%86%B5%402x.png" />
        <div class="icons-container">
          <div class="item">
            <div class="icons-item">
              <span class="number">{{ parkInfo.base?.buildingTotal }}</span>
            </div>
            <span class="title">楼宇总数</span>
            <span class="unity">(栋)</span>
          </div>
          <div class="item">
            <div class="icons-item">
              <span class="number">{{ parkInfo.base?.enterpriseTotal }}</span>
            </div>
            <span class="title">入驻企业总数</span>
            <span class="unity">(家)</span>
          </div>
          <div class="item">
            <div class="icons-item">
              <span class="number">{{ parkInfo.base?.parkingTotal }}</span>
            </div>
            <span class="title">车位总数</span>
            <span class="unity">(个)</span>
          </div>
          <div class="item">
            <div class="icons-item">
              <span class="number">{{ parkInfo.base?.chargePoleTotal }}</span>
            </div>
            <span class="title">一体杆总数</span>
            <span class="unity">(个)</span>
          </div>
        </div>
      </div>
      <div class="section-two">
        <img alt="logo" class="img-header"
          src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E5%B9%B4%E5%BA%A6%E6%94%B6%E5%85%A5%E5%88%86%E6%9E%90%402x.png" />
        <div class="bar-chart-title">
          <span>单位：元</span>
          <div>
            <span class="bar-icon blue-bar-icon"></span>
            <span class="bar-icon red-bar-icon"></span>
            收入情况
          </div>
        </div>
        <div class="bar-chart"> </div>
      </div>
      <div class="section-three">
        <img alt="logo" class="img-header"
          src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E4%BA%A7%E4%B8%9A%E5%88%86%E5%B8%83%402x.png" />
        <div class="pie-chart"></div>
      </div>
    </div>
    <div class="model-container">
      <LoadingComponent :loading="loadStatus"></LoadingComponent>
      <!-- 准备3D渲染节点 -->
      <canvas class="canvas-3d" ref="ref3d"></canvas>
      <!-- 点击信息 -->
      <div v-if="modelStatus && (areaInfo || buildingInfo)" id="t" :class="{ animate__zoomIn: modelStatus }"
        :style="{ left: x + 'px', top: y + 'px' }" class="tip animate__animated">
        <span class="close" @mousedown.stop="close"></span>
        <div v-if="buildingInfo">
          <div class="header">{{ buildingInfo.name }}</div>
          <div>
            <div>楼层数：{{ buildingInfo.floors }}</div>
            <div>总面积:{{ buildingInfo.area }}</div>
            <div>承租单位:{{ buildingInfo.rentEnterpriseName ? buildingInfo.rentEnterpriseName : '暂无' }}</div>
          </div>
        </div>
        <div v-if="areaInfo">
          <div class="header">{{ areaInfo.areaName }}</div>
          <div>
            <div>空闲车位：{{ areaInfo.remainSpaceNum }}</div>
            <div>占用车位:{{ areaInfo.occupancySpaceNum }}</div>
            <div>停车位数:{{ areaInfo.totalSpaceNum }}</div>
            <div>面积:{{ areaInfo.areaProportion }}</div>
          </div>
        </div>
      </div>
    </div>
  </v-scale-screen>
</template>
<script setup>
import * as echarts from 'echarts';
import { onMounted, ref, computed } from 'vue'
import { getParkInfoApi } from '@/api/park'
import VScaleScreen from 'v-scale-screen'
import { Application } from '@splinetool/runtime'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { getBuildingInfoApi, getAreaInfoApi } from '@/api/park'

// 获取数据
const parkInfo = ref({})
const getlist = async () => {
  try {
    const res = await getParkInfoApi()
    console.log(res);
    parkInfo.value = res.data
  } catch (error) {
    console.log(error);
  }
}
// 渲染年度分析收入表
const initBarChart = () => {
  // 获取图表数据
  const { parkIncome } = parkInfo.value
  // console.log(Array.from(parkIncome.yIncome));
  // console.log('yIncome', yIncome);
  // 准备options数据
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '0',
      top: '10px',
      bottom: '0',
      right: '0',
      containLabel: true,
      show: false
    },
    xAxis: {
      type: 'category',
      data: parkIncome?.xMonth,
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      }
    },
    series: [
      {
        barWidth: '10px',
        data: parkIncome?.yIncome.map((item, index) => {
          let color = ''
          if (index % 2 === 0) {
            color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0.23, color: '#74c0f8' },
              { offset: 1, color: 'rgba(116,192,248,0.00)' }
            ])
          } else {
            color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0.23, color: '#ff7152' },
              { offset: 1, color: 'rgba(255,113,82,0.00)' }
            ])
          }
          return {
            value: item,
            itemStyle: {
              color: color
            }
          }
        }),

        type: 'bar'
      }
    ],
    textStyle: {
      color: '#B4C0CC'
    }
  }

  // 获取dom
  const barChart = echarts.init(document.querySelector('.bar-chart'))
  // 使用刚指定的配置项和数据显示图表。
  barChart.setOption(option);
}
// 渲染园区产业分布
const initPieChart = () => {
  const { parkIndustry } = parkInfo.value

  const option = {
    color: ['#00B2FF', '#2CF2FF', '#892CFF', '#FF624D', '#FFCF54', '#86ECA2'],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      // top: '5%',
      left: 'center',
      bottom: '0',
      icon: 'rect',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#c6d1db'
      }
    },
    series: [
      {
        name: '园区产业分析',
        type: 'pie',
        radius: ['55%', '60%'],
        avoidLabelOverlap: false,
        center: ['50%', '40%'],
        label: {
          show: false,
          position: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return `${params.seriesName} <br/>${params.marker}  ${params.name} ${params.percent}%`
          }
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: parkIndustry
      }
    ]
  }

  const pieChart = echarts.init(document.querySelector('.pie-chart'))
  pieChart.setOption(option);
}


// 初始化3d模型
const ref3d = ref(null)
const loadStatus = ref(false)
const showModel = ref(false)
let x = ref()
let y = ref()
const buildingInfo = ref({})
const areaInfo = ref({})
const init3dModel = () => {
  loadStatus.value = true
  // 实例化解析器
  let spline = new Application(ref3d.value)
  // 拉取模型
  spline.load('https://fe-hmzs.itheima.net/scene.splinecode').then(res => {
    console.log('加载完毕');
    loadStatus.value = false


    // 点击事件
    spline.addEventListener('mouseDown', (e) => {
      // console.log('123123', e);
      x.value = ''
      y.value = ''
      buildingInfo.value = null
      areaInfo.value = null
      const params = e.target

      if (params.name.indexOf('办公楼') !== -1) {
        getBuildingInfo(params.id)
        window.addEventListener('mousedown', (e) => {
          buildingInfo.value = null
          if (params.id) {
            x.value = e.offsetX
            y.value = e.offsetY
          }
        })
      } else if (params.name.indexOf('停车场') !== -1) {
        getAreaInfo(params.id)
        window.addEventListener('mousedown', (e) => {
          areaInfo.value = null
          if (params.id) {
            x.value = e.offsetX
            y.value = e.offsetY
          }
        })
      }
      showModel.value = true
    })
  })
}

// 获取楼宇数据
const getBuildingInfo = async (id) => {
  try {
    const res = await getBuildingInfoApi(id)
    buildingInfo.value = res.data
  } catch (error) {
    console.log(error);
  }
}
// 获取停车场数据
const getAreaInfo = async (id) => {
  try {
    const res = await getAreaInfoApi(id)
    areaInfo.value = res.data
  } catch (error) {
    console.log(error);
  }
}

const modelStatus = computed(() => {
  if (x.value && y.value) {
    console.log(x.value, y.value);
    return true
  } else {
    return false
  }
})

const close = () => {
  x.value = ''
  y.value = ''
  console.log(x.value, y.value)
}



onMounted(async () => {
  await getlist()
  initBarChart()
  initPieChart()
  init3dModel()
})

</script>


<style lang="scss" scoped>
.all-charts {
  width: 480px;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(to left,
      rgba(0, 6, 15, 0) 0%,
      rgba(0, 6, 15, 0) 20%,
      rgba(0, 0, 0, 0.4) 30%,
      rgba(0, 0, 0, 0.6) 40%,
      rgba(1, 4, 11, 1) 70%,
      #04070d 100%);
  padding: 88px 20px 0 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;

  .img-header {
    height: 30px;
  }

  .section-one {
    flex-basis: 25%;


    .icons-container {
      display: flex;
      justify-content: space-between;
      padding: 20px 0;

      .item {
        flex: 1;

        display: flex;
        flex-direction: column;
        align-items: center;

        .icons-item {
          width: 100%;
          height: 80px;
          background: url('@/assets/building-icon.png') no-repeat 50% 0 / contain;
          position: relative;

          .number {
            font-size: 18px;
            font-family: FontquanXinYiGuanHeiTi, FontquanXinYiGuanHeiTi-Regular;
            color: #ffffff;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }
        }

        .title,
        .unity {
          font-size: 14px;
          color: #cdd7e1;
        }

        .title {
          margin-top: 8px;
        }
      }
    }
  }

  .section-two {
    flex-basis: 35%;



    .bar-chart-title {
      display: flex;
      justify-content: space-between;
      height: 30px;
      align-items: center;

      .bar-icon {
        width: 30px;
        height: 10px;
        background: red;
        display: inline-block;
      }

      .blue-bar-icon {
        background: linear-gradient(90deg, #74c0f8, rgba(116, 192, 248, 0));
      }

      .red-bar-icon {
        background: linear-gradient(90deg, #ff7152, rgba(255, 113, 82, 0));
      }
    }

    .bar-chart {
      height: calc(100% - 60px);
    }
  }

  .section-three {
    flex-basis: 35%;

    .pie-chart {
      height: calc(100% - 30px);
      margin: 0 auto;
      padding-bottom: 20px;
      width: 80%;
    }
  }
}

.model-container {
  width: 100%;
  height: 100%;
  background: black;

  .tip {
    width: 281px;
    height: 140px;
    background: url('@/assets/modal-bg.png') no-repeat;
    background-size: cover;
    color: #fff;
    //display: none;
    position: absolute;
    //left: 0;
    //top: 0;

    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 20px;
      height: 20px;
      background: url('@/assets/modal-close.png') no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
</style>
