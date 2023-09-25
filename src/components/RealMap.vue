<!-- <template>
    <div class="spaceMeasurement">
      <div class="chart" id="RealMap">yesok</div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import 'echarts-gl';
import {onMounted, ref} from 'vue'


onMounted(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;
    console.log(mapboxgl.accessToken);
    const map = new mapboxgl.Map({
        container: 'RealMap', // container ID
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [118.803859,32.01], // starting position
        zoom: 10 // starting zoom
    });

    map.on('load', () => {
        render();
    })
})

</script>


<style scoped>
.chart {
  height: 50vh;
}
</style> -->