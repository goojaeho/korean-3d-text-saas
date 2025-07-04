import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 테스트 사용자 생성
  const testUser = await prisma.user.upsert({
    where: { email: 'test@korean3dtext.com' },
    update: {},
    create: {
      email: 'test@korean3dtext.com',
      name: '테스트 사용자',
      password: '$2a$10$example.hashed.password.here', // 실제 환경에서는 bcrypt로 해시된 비밀번호
      emailVerified: new Date(),
      plan: 'FREE',
      credits: 10,
    },
  });

  console.log('✅ Created test user:', testUser.email);

  // 샘플 프로젝트들 생성
  const sampleProjects = [
    {
      title: '안녕하세요 - 기본 텍스트',
      description: '한글 3D 텍스트의 기본 예제입니다.',
      textContent: {
        text: '안녕하세요',
        color: '#3b82f6',
        fontSize: 48,
        fontFamily: 'Noto Sans KR',
        animationType: 'rotate',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      isPublic: true,
    },
    {
      title: '한글 3D 텍스트 - 플로팅 효과',
      description: '위아래로 움직이는 플로팅 애니메이션이 적용된 텍스트입니다.',
      textContent: {
        text: '한글 3D 텍스트',
        color: '#ef4444',
        fontSize: 36,
        fontFamily: 'Noto Sans KR',
        animationType: 'float',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      isPublic: true,
    },
    {
      title: '펄스 효과 - 크기 변화',
      description: '크기가 변하는 펄스 애니메이션이 적용된 텍스트입니다.',
      textContent: {
        text: '펄스 효과',
        color: '#10b981',
        fontSize: 52,
        fontFamily: 'Noto Sans KR',
        animationType: 'pulse',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      isPublic: false,
    },
    {
      title: '웨이브 모션 - 물결 효과',
      description: 'X, Y축으로 물결치는 웨이브 애니메이션입니다.',
      textContent: {
        text: '웨이브 모션',
        color: '#8b5cf6',
        fontSize: 40,
        fontFamily: 'Noto Sans KR',
        animationType: 'wave',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      isPublic: true,
    },
  ];

  for (const projectData of sampleProjects) {
    const project = await prisma.project.create({
      data: {
        ...projectData,
        userId: testUser.id,
      },
    });
    console.log(`✅ Created project: ${project.title}`);
  }

  // 샘플 내보내기 기록 생성
  const projects = await prisma.project.findMany({
    where: { userId: testUser.id },
  });

  for (const project of projects.slice(0, 2)) {
    const exportRecord = await prisma.projectExport.create({
      data: {
        format: 'PNG',
        width: 1920,
        height: 1080,
        quality: 100,
        projectId: project.id,
        fileUrl: `https://example.blob.vercel-storage.com/${project.id}.png`,
        fileSize: 1024 * 1024, // 1MB
      },
    });
    console.log(`✅ Created export record for: ${project.title}`);
  }

  // 사용자 활동 로그 생성
  await prisma.userActivity.create({
    data: {
      userId: testUser.id,
      action: 'create_project',
      metadata: {
        projectId: projects[0]?.id,
        title: projects[0]?.title,
      },
    },
  });

  await prisma.userActivity.create({
    data: {
      userId: testUser.id,
      action: 'export_project',
      metadata: {
        projectId: projects[0]?.id,
        format: 'PNG',
      },
    },
  });

  console.log('✅ Created user activity logs');

  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Created:');
  console.log('- 1 test user');
  console.log('- 4 sample projects');
  console.log('- 2 export records');
  console.log('- 2 activity logs');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });