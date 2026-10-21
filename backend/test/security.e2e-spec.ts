import { useTestApp } from './support/test-app';

describe('security (e2e)', () => {
  const { http } = useTestApp();

  it("xavfsizlik sarlavhalari qo'yiladi, X-Powered-By yashiriladi", async () => {
    const res = await http().get('/students').expect(200);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('CORS: faqat ruxsat etilgan frontend manziliga ochiq', async () => {
    const allowed = await http()
      .get('/students')
      .set('Origin', 'http://localhost:5173');
    expect(allowed.headers['access-control-allow-origin']).toBe(
      'http://localhost:5173',
    );

    const other = await http()
      .get('/students')
      .set('Origin', 'https://evil.example');
    expect(other.headers['access-control-allow-origin']).toBeUndefined();
  });
});
