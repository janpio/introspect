import { ImageResponse } from 'next/server';

export const size = {
  height: 32,
  width: 32,
};
export const contentType = 'image/png';
export const runtime = 'edge';

export default function icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'darkblue',
          color: 'white',
          display: 'flex',
          fontSize: 32,
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        I
      </div>
    ),
    size,
  );
}
