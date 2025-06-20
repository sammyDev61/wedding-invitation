import { Map, MapMarker } from "react-kakao-maps-sdk";
import styles from "./styles/MapSection.module.css";

function MapSection() {
  const position = { lat: 37.58183549788911, lng: 126.97141930480986 };
  return (
    <div className={styles.container}>
      <div className={styles.mapText}>
        오시는길
      </div>
      <Map
      center={position}
      level={1}
      className={styles.map}
      >
        <MapMarker position={position} />
      </Map>
      {/* 네이버지도 / 카카오맵 버튼 매핑 */}
      {/* 
      https://map.naver.com/p/directions/-/14134394.4764838,4520517.7853017,%EA%B9%8C%EB%8D%B8%EB%A3%A8%EB%BD%80,13517637,PLACE_POI/-/transit?c=15.00,0,0,0,dh
      https://map.kakao.com/?target=car&eX=493689&eY=1133965&eName=%EA%B9%8C%EB%8D%B8%EB%A3%A8%EB%BD%80&from=total&ids=%2CP8578395&rtIds=%2CP8578395
      */}
      <div className={styles.mapText}>
        까델루뽀<br/>
        서울 종로구 자하문로16길 5-5
      </div>
      {/* 주차 / 지하철 / 버스 */}
      {/* devider, 제목 스타일 */}
    </div>
  );
}

export default MapSection;
