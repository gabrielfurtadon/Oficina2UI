import { test, expect } from '@playwright/test';

test.describe.serial('Fluxo E2E - Certificados de Participação', () => {

  const userEmail = 'usuario_teste@utfpr.edu.br';
  const userPassword = 'Teste@1234';
  const workshopTitle = 'Workshop de Teste E2E';

  test('1. Cadastra um usuário', async ({ page }) => {

    await page.goto('http://localhost:3000/');

    await page.click('button:has-text("Ainda não tem uma conta? Registre-se aqui!")');

    await page.fill('input[name="name"]', 'Usuário Teste');
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', userPassword);
    await page.fill('input[name="confirmPassword"]', userPassword);
    await page.click('button:has-text("Registrar")');

    await expect(page.locator('h2')).toHaveText('Login');
  });

  test('2. Faz login com o usuário cadastrado', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', userPassword);
    await page.click('button:has-text("Entrar")');

    await expect(page.locator('h1')).toHaveText(/ELLP Ensino Lúdico de Lógica e Programação/);
  });

  test('3. Cadastra 3 participantes', async ({ page }) => {
    await page.goto('http://localhost:3000/homepage');
    await page.click('text=Cadastrar Participantes');

    const participantes = [
      { name: 'Participante 1', ra: 'RA001' },
      { name: 'Participante 2', ra: 'RA002' },
      { name: 'Participante 3', ra: 'RA003' },
    ];

    for (const participante of participantes) {
      await page.fill('input[name="name"]', participante.name);
      await page.fill('input[name="ra"]', participante.ra);

      page.once('dialog', async dialog => await dialog.accept());
      await page.click('button:has-text("Cadastrar")');

      await page.waitForTimeout(500);
    }

    await page.click('button:has-text("Voltar")');
    await expect(page).toHaveURL(/homepage/);
  });

  test('4. Cadastra um workshop', async ({ page }) => {
    await page.goto('http://localhost:3000/homepage');
    await page.click('text=Cadastrar Workshops');

    await page.fill('input[name="titulo"]', workshopTitle);
    await page.fill('textarea[name="descricao"]', 'Workshop de teste para E2E');
    await page.fill('input[name="data"]', '2025-02-10');
    await page.fill('input[name="duracao"]', '4');
    await page.fill('input[name="numeroMaxParticipantes"]', '5');
    await page.selectOption('select[name="tipoEvento"]', 'PRESENCIAL');
    

    page.once('dialog', async dialog => await dialog.accept());
    await page.click('button:has-text("Cadastrar")');

    await expect(page).toHaveURL(/workshops/);
    await expect(page.locator('text=' + workshopTitle)).toBeVisible();
  });

  test('5. Gerencia workshop: adiciona 3 participantes ao workshop cadastrado', async ({ page }) => {
    await page.goto('http://localhost:3000/homepage');
    await page.click('text=Gerencie Workshops');

    const workshopItem = page.locator('li', { hasText: workshopTitle });
    await expect(workshopItem).toBeVisible();

    const manageParticipantsButton = page.locator('#root > div > div > ul > li:nth-child(2) > div > button.text-green-600.hover\\:text-green-800');

    await expect(manageParticipantsButton).toBeVisible({ timeout: 5000 });
    await manageParticipantsButton.click();

    await expect(page.locator('text=Gerenciar Participantes')).toBeVisible({ timeout: 5000 });

    // Marca os checkboxes para os RAs selecionados
    for (const ra of ['RA001', 'RA002', 'RA003']) {
        const checkbox = page.locator(`li:has-text("RA: ${ra}") >> input[type="checkbox"]`);
        await checkbox.check();
    }

    await page.click('button:has-text("Salvar")');

    
    await expect(page.locator('text=Gerenciar Participantes')).not.toBeVisible({ timeout: 5000 });

    const expandButton = workshopItem.locator('button:has-text("Participantes")');
    await expandButton.click();

    for (const ra of ['RA001', 'RA002', 'RA003']) {
        await expect(workshopItem.locator(`text=${ra}`)).toBeVisible();
    }
});



  test('6. Gera e baixa certificados para o workshop', async ({ page }) => {
    await page.goto('http://localhost:3000/homepage');

    await page.click('text=Geração de Certificados por Workshop');

    const workshopItem = page.locator('li', { hasText: workshopTitle });
    await workshopItem.waitFor({ state: 'visible', timeout: 5000 });

    const downloadButton = workshopItem.locator('button:has-text("Baixar certificados")');
    await downloadButton.waitFor({ state: 'visible', timeout: 5000 });

    const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 30000 }),
        downloadButton.click()
    ]);

    const filename = download.suggestedFilename();
    console.log("Nome do arquivo baixado:", filename);

    expect(filename).not.toBeNull();
    const expectedTitle = `certificados_${workshopTitle.replace(/\s/g, '_')}.zip`;
    const receivedTitle = filename.replace(/\s/g, '_');
    expect(receivedTitle).toBe(expectedTitle);

});
});
