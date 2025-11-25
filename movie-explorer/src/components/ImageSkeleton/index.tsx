interface IImageSkeletonProps {
  /** Optional CSS classes to apply to the skeleton */
  className?: string;
}

export const ImageSkeleton = ({ className = '' }: IImageSkeletonProps) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-br from-slate-700 to-slate-600 ${className}`}
    />
  );
};
