import { appToday } from '../src/common/app-config';
import { useTestApp, validStudent } from './support/test-app';

describe('students (e2e)', () => {
  const { http, createStudent, addPayment } = useTestApp();

  it("CRUD: yaratish, ro'yxat, bitta, tahrirlash, o'chirish", async () => {
    const created = await createStudent();
    expect(created).toMatchObject({ ...validStudent, id: expect.any(Number) });

    const list = await http().get('/students').expect(200);
    expect(list.body).toHaveLength(1);

    await http().get(`/students/${created.id}`).expect(200);

    const updated = await http()
      .patch(`/students/${created.id}`)
      .send({ monthlyFee: 600_000 })
      .expect(200);
    expect(updated.body).toMatchObject({
      monthlyFee: 600_000,
      name: validStudent.name,
    });

    await http().delete(`/students/${created.id}`).expect(200);
    await http().get(`/students/${created.id}`).expect(404);
  });

  it("telefondagi bo'shliq va chiziqchalar olib tashlanadi, ism trim qilinadi", async () => {
    const res = await http()
      .post('/students')
      .send({ ...validStudent, name: '  Vali  ', phone: '+998 90 123-45-67' })
      .expect(201);
    expect(res.body).toMatchObject({ name: 'Vali', phone: '+998901234567' });
  });

  it("joinedAt berilmasa bugungi sana qo'yiladi", async () => {
    const { name, phone, group, monthlyFee } = validStudent;
    const res = await http()
      .post('/students')
      .send({ name, phone, group, monthlyFee })
      .expect(201);
    expect(res.body.joinedAt).toBe(appToday());
  });

  it.each([
    ["ism bo'sh", { name: '   ' }],
    ["telefon noto'g'ri", { phone: '901234567' }],
    ['telefon boshqa davlat', { phone: '+79001234567' }],
    ["guruh yo'q", { group: undefined }],
    ['summa manfiy', { monthlyFee: -1 }],
    ['summa nol', { monthlyFee: 0 }],
    ['summa kasr', { monthlyFee: 100.5 }],
    ['summa matn', { monthlyFee: '500000' }],
    ['sana mavjud emas', { joinedAt: '2026-02-30' }],
    ['ortiqcha maydon', { isAdmin: true }],
  ])('400: %s', async (_case, patch) => {
    await http()
      .post('/students')
      .send({ ...validStudent, ...patch })
      .expect(400);
  });

  it("400: joinedAt mavjud to'lovdan keyinga surilsa", async () => {
    const { id } = await createStudent();
    await addPayment(id, 100_000, '2026-08-10').expect(201);

    await http()
      .patch(`/students/${id}`)
      .send({ joinedAt: '2026-09-01' })
      .expect(400);
    await http()
      .patch(`/students/${id}`)
      .send({ joinedAt: '2026-08-10' })
      .expect(200);
  });

  it("404: mavjud bo'lmagan o'quvchi (get, patch, delete)", async () => {
    await http().get('/students/9999').expect(404);
    await http().patch('/students/9999').send({ name: 'X' }).expect(404);
    await http().delete('/students/9999').expect(404);
  });

  it.each(['abc', '0', '-1', '1.5', '99999999999'])(
    '400: id=%p',
    async (id) => {
      await http().get(`/students/${id}`).expect(400);
    },
  );
});
