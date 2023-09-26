<template>
    <div class="chart" id="MapBoxMap"></div>
</template>

<script setup>
import {onMounted, ref} from 'vue';

onMounted(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;
    const map = new mapboxgl.Map({
      container: 'MapBoxMap', // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [114.01734206375036,22.628710311083694], // starting position
      zoom: 10 // starting zoom
    });


    // $.ajaxSettings.async = false;
    $.get('/src/assets/zf_com_info.geojson', (zf_com_info) => {
        // console.log(zf_com_info);
        map.on('load', () => {
            // Add a data source containing GeoJSON data.
            map.addSource('zf_com_info', {
                'type': 'geojson',
                'data': zf_com_info
            });
            // 定义颜色范围
            const colorRange = [
                '#e0efff',
                '#4080ff',
            ];

            // Add a layer showing the places.
            map.addLayer({
                'id': 'zf_com',
                'type': 'circle',
                'source': 'zf_com_info',
                'paint': {
                    'circle-color': '#4264fb',
                    'circle-radius': 6,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            });

            // Create a popup, but don't add it to the map yet.
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
            
            map.on('mouseenter', 'zf_com', (e) => {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';
                // Copy coordinates array.
                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.com_name;

                console.log(e);
                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                // }
                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates).setHTML(description).addTo(map);
            });
            
            map.on('mouseleave', 'zf_com', () => {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });
        });


    })
    // console.log(zf_com_info)



})




</script>


<style scoped>
.chart {
  height: 50vh;
}
</style>