import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { addLike, removeLike, checkLike, Likes } from '@/apis/Likes.api';
import { IPerformancePayload } from './usePerformances';

export interface ILikePayload {
  email?: string;
  codename?: string;
  title?: string;
  date?: string;
}

// 좋아요 훅
export const useLikes = () => {
  const queryClient = useQueryClient();

  // 좋아요 추가 뮤테이션
  const addLikeMutation = useMutation<void, AxiosError, ILikePayload>({
    mutationKey: ['addLike'],
    mutationFn: (payload) => addLike(payload), // 객체 형태로 전달
    onSuccess() {
      queryClient.invalidateQueries(); // 쿼리 무효화
    },
    onError: (error: any) => {
      console.error('좋아요 추가 오류:', error);
    },
  });

  // 좋아요 삭제 뮤테이션
  const removeLikeMutation = useMutation<void, AxiosError, ILikePayload>({
    mutationKey: ['removeLike'],
    mutationFn: (payload) => removeLike(payload), // 객체 형태로 전달
    onSuccess() {
      queryClient.invalidateQueries(); // 쿼리 무효화
    },
    onError: (error: any) => {
      console.error('좋아요 삭제 오류:', error);
    },
  });

  // 좋아요 상태 확인 쿼리
  const checkLikeQuery = (email?: string, codename?: string, title?: string, date?: string) => {
    return useQuery<boolean, Error>({
      queryKey: [
        'likes',
        {
          email,
          codename,
          title,
          date,
        },
      ],
      queryFn: () => checkLike(email, codename, title, date),
      enabled: !!email && !!codename && !!title && !!date,
    });
  };

  // 좋아요 조회 쿼리
  const likesQuery = (email?: string) => {
    return useQuery<IPerformancePayload[], Error, IPerformancePayload[]>({
      queryKey: [
        'likes',
        {
          email,
        },
      ],
      queryFn: () => Likes(email),
      enabled: !!email,
    });
  };

  return {
    addLike: addLikeMutation.mutate,
    removeLike: removeLikeMutation.mutate,
    checkLike: checkLikeQuery,
    getLikes: likesQuery,
    addLikeStatus: addLikeMutation.status,
    removeLikeStatus: removeLikeMutation.status,
    addLikeError: addLikeMutation.error,
    removeLikeError: removeLikeMutation.error,
  };
};
