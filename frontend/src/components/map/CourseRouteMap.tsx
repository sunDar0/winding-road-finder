'use client';

import { CourseNav } from '@/types/course';

interface CourseRouteMapProps {
  navPoints: CourseNav[];
  courseName: string;
  className?: string;
  naverMapUrl: string;
  detailImageUrl?: string; // 백엔드에서 제공하는 상세 이미지 URL
}

export function CourseRouteMap({ 
  navPoints, 
  courseName, 
  className = '', 
  naverMapUrl,
  detailImageUrl 
}: CourseRouteMapProps) {
  const routeInfo = calculateRouteInfo();

  // 경로 정보 계산 함수
  function calculateRouteInfo() {
    if (!navPoints || navPoints.length < 2) {
      return null;
    }
    let totalDistance = 0;
    for (let i = 0; i < navPoints.length - 1; i++) {
      const current = navPoints[i];
      const next = navPoints[i + 1];
      const R = 6371;
      const dLat = (next.geolocation.latitude - current.geolocation.latitude) * Math.PI / 180;
      const dLon = (next.geolocation.longitude - current.geolocation.longitude) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(current.geolocation.latitude * Math.PI / 180) * Math.cos(next.geolocation.latitude * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      totalDistance += distance;
    }
    
    return {
      distance: Math.round(totalDistance * 10) / 10,
    };
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">코스 경로</h3>
        <p className="text-sm text-gray-600">코스의 주요 지점들을 확인하세요</p>
      </div>
      
      {/* Static Map */}
      {detailImageUrl ? (
        <div className="relative">
          <img 
            src={`http://localhost:8080${detailImageUrl}`}
            alt={`${courseName} 코스 경로`}
            className="w-full h-[600px] max-w-3xl mx-auto object-cover rounded-lg border border-gray-200 shadow-md"
            loading="lazy"
            onError={(e) => {
              console.error('이미지 로드 실패:', detailImageUrl);
              // 이미지 로드 실패 시 기본 이미지 또는 플레이스홀더 표시
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* 경로 정보 오버레이 */}
          {routeInfo && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="font-medium">직선거리: {routeInfo.distance}km</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p>경로 정보가 없습니다</p>
          </div>
        </div>
      )}
      
      {/* 네이버 지도 링크 */}
      {naverMapUrl && (
        <div className="flex justify-center">
          <a 
            href={naverMapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
          >
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>네이버 지도에서 상세 경로 보기</span>
          </a>
        </div>
      )}
      
      {/* 경로점 목록 */}
      {navPoints && navPoints.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">경로점</h4>
          <div className="space-y-2">
            {navPoints.map((point, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-red-500' : 
                  index === navPoints.length - 1 ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{point.name}</p>
                  <p className="text-sm text-gray-600">{point.type}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {point.geolocation.latitude.toFixed(6)}, {point.geolocation.longitude.toFixed(6)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 