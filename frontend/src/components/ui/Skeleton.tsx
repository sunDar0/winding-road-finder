import React from 'react';

export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      {...props}
    />
  );
}

// 카드 스켈레톤
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-4 w-6 mx-auto" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
}

// 코스 카드 스켈레톤
export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-8 w-12 ml-4" />
      </div>
      
      {/* 지도 썸네일 스켈레톤 */}
      <Skeleton className="w-full h-48 aspect-square mb-4 rounded-lg" />
      
      {/* 태그 스켈레톤 */}
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      {/* 경로점 스켈레톤 */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Skeleton className="w-2 h-2 rounded-full mr-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center">
          <Skeleton className="w-2 h-2 rounded-full mr-2" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center">
          <Skeleton className="w-2 h-2 rounded-full mr-2" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    </div>
  );
}

// 추천 카드 스켈레톤
export function RecommendationCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
        </div>
        <Skeleton className="h-6 w-16 ml-4" />
      </div>
      
      {/* 지도 썸네일 스켈레톤 */}
      <Skeleton className="w-full h-48 aspect-square mb-4 rounded-lg" />
      
      {/* 코스 목록 스켈레톤 */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="space-y-1">
          <div className="flex items-center">
            <Skeleton className="w-1.5 h-1.5 rounded-full mr-2" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center">
            <Skeleton className="w-1.5 h-1.5 rounded-full mr-2" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="flex items-center">
            <Skeleton className="w-1.5 h-1.5 rounded-full mr-2" />
            <Skeleton className="h-3 w-30" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 통계 카드 스켈레톤
export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="text-center">
        <Skeleton className="h-8 w-16 mx-auto mb-2" />
        <Skeleton className="h-4 w-20 mx-auto" />
      </div>
    </div>
  );
}

// 필터 스켈레톤
export function FilterSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
} 