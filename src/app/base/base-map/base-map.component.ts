import { AfterViewInit, Component, OnInit } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON';
import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import pointsDataset from 'src/app/dummy/points.dataset';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import * as olProj from 'ol/proj';
import { Modify, Snap } from 'ol/interaction';
import Draw from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType'
import Source from 'ol/source/Source';

@Component({
  selector: 'app-base-map',
  templateUrl: './base-map.component.html',
  styleUrls: ['./base-map.component.scss']
})
export class BaseMapComponent implements OnInit, AfterViewInit {

  map: any;
  draw: Draw | undefined;
  snap: Snap | undefined;
  modify: Modify | undefined;
  dummyShops = pointsDataset;
  reader = new GeoJSON({
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  })
  shops = this.dummyShops.features.map(x => {
    let _name = x.properties.name;
    let _type = x.properties.type
    return {
      name: _name,
      type: _type
    }
  })

  selectShops = [...new Set(this.shops.map(item => item.type))]


  constructor() { }


  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    });

  }

  initMap() {
    this.map = new Map({
      target: "map",
      view: new View({
        center: olProj.transform([30, 40], 'EPSG:4326', 'EPSG:3857'),
        zoom: 8
      }),
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ]
    })
  }

  vectorSource = new VectorSource();


  selectShopType(shopType: any) {
    let _features = this.reader.readFeatures(this.dummyShops).filter(x => x.getProperties().type == shopType)
    let _layer = this.addSourceToLayer(this.vectorSource, _features, shopType)
    this.addVectorLayerToMap(_layer)
  }


  addSourceToLayer(vectorSource: VectorSource, features: any, layerName: string) {
    vectorSource.addFeatures(features);
    let layer = new VectorLayer({
      source: vectorSource
    })
    layer.set("name", layerName)
    return layer;
  }

  addVectorLayerToMap(layer: VectorLayer) {
    for (const _mapLayer of this.map.getLayers().getArray()) {
      if (_mapLayer.get("name") === layer.get("name")) {
        break;
      }
    }
    this.map.addLayer(layer);
  }

  onDrawPoylgon() {

    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.snap);
    this.addInteractions();


  }

  addInteractions() {
    console.log("drawing");
    this.draw = new Draw({
      source: this.vectorSource,
      type: GeometryType["POLYGON"]
    })
    this.map.addInteraction(this.draw)

    this.snap = new Snap({
      source: this.vectorSource
    })
    this.map.addIntereaction(this.snap)
  }
}
