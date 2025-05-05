// Kullanıcıyı oluştur
const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    role: 'USER', // Rol açıkça USER olarak belirtiliyor
    backupCodes: JSON.stringify([]), // SQLite için String tipinde boş bir array
  },
}); 