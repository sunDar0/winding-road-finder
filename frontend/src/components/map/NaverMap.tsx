'use client';

import { CourseNav } from '@/types/course';
import { useEffect, useRef, useState } from 'react';

interface NaverMapProps {
  navPoints: CourseNav[];
  courseName: string;
  className?: string;
}

declare global {
  interface Window {
    naver: any;
  }
}

export function NaverMap({ navPoints, courseName, className = '' }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [polyline, setPolyline] = useState<any>(null);

  useEffect(() => {
    // 네이버 지도 API 스크립트 로드
    const loadNaverMapScript = () => {
      if (window.naver) return Promise.resolve();
      
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('네이버 지도 API 로드 실패'));
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        await loadNaverMapScript();
        
        if (!mapRef.current || !window.naver) return;

        // 지도 초기화
        const mapInstance = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(36.5, 127.5), // 한국 중심
          zoom: 7,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.naver.maps.MapTypeControlStyle.DROPDOWN
          },
          zoomControl: true,
          zoomControlOptions: {
            style: window.naver.maps.ZoomControlStyle.SMALL,
            position: window.naver.maps.Position.TOP_RIGHT
          }
        });

        setMap(mapInstance);

        // 경로점이 있으면 지도 중심과 줌 조정
        if (navPoints.length > 0) {
          const bounds = new window.naver.maps.LatLngBounds();
          
          // 마커 생성
          const newMarkers = navPoints.map((point, index) => {
            const position = new window.naver.maps.LatLng(
              point.geolocation.latitude,
              point.geolocation.longitude
            );
            
            bounds.extend(position);

            const marker = new window.naver.maps.Marker({
              position,
              map: mapInstance,
              title: point.name,
              icon: {
                content: `
                  <div style="
                    background: #3B82F6;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: bold;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  ">
                    ${index + 1}
                  </div>
                `,
                size: new window.naver.maps.Size(30, 30),
                anchor: new window.naver.maps.Point(15, 15)
              }
            });

            // 정보창 생성
            const infoWindow = new window.naver.maps.InfoWindow({
              content: `
                <div style="padding: 10px; min-width: 200px;">
                  <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">
                    ${point.name}
                  </h3>
                  <p style="margin: 0; font-size: 12px; color: #666;">
                    ${point.type}
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 11px; color: #999;">
                    ${point.geolocation.latitude.toFixed(6)}, ${point.geolocation.longitude.toFixed(6)}
                  </p>
                </div>
              `
            });

            // 마커 클릭 이벤트
            window.naver.maps.Event.addListener(marker, 'click', () => {
              infoWindow.open(mapInstance, marker);
            });

            return marker;
          });

          setMarkers(newMarkers);

          // 경로선 생성 (2개 이상의 점이 있을 때)
          if (navPoints.length > 1) {
            const path = navPoints.map(point => 
              new window.naver.maps.LatLng(
                point.geolocation.latitude,
                point.geolocation.longitude
              )
            );

            const polylineInstance = new window.naver.maps.Polyline({
              path,
              strokeColor: '#3B82F6',
              strokeWeight: 4,
              strokeOpacity: 0.8,
              strokeStyle: 'solid',
              map: mapInstance
            });

            setPolyline(polylineInstance);
          }

          // 지도 범위 조정
          mapInstance.fitBounds(bounds, {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
          });
        }

      } catch (error) {
        console.error('네이버 지도 초기화 실패:', error);
      }
    };

    initializeMap();

    // 클린업
    return () => {
      if (map) {
        markers.forEach(marker => marker.setMap(null));
        if (polyline) polyline.setMap(null);
      }
    };
  }, [navPoints, courseName]);

  return (
    <div className={`relative ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">코스 경로</h3>
        <p className="text-sm text-gray-600">코스의 주요 지점들을 확인하세요</p>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg shadow-md border border-gray-200"
        style={{ minHeight: '400px' }}
      />
      
      {navPoints.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <svg className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p>경로 정보가 없습니다</p>
          </div>
        </div>
      )}
    </div>
  );
} 