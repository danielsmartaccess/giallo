// Script para adicionar interatividade avançada ao cardápio
// Aguardamos o DOM para garantir que todos os elementos estejam acessíveis
document.addEventListener('DOMContentLoaded', () => {
  // Referências principais usadas ao longo do script
  const searchInput = document.getElementById('search');
  const ingredientContainer = document.getElementById('ingredient-filters');
  const suggestionPanel = document.getElementById('ingredient-suggestions');
  const filterCount = document.getElementById('filter-count');
  const clearFiltersButton = document.getElementById('clear-filters');
  const limitWarning = document.getElementById('limit-warning');
  const menuItems = Array.from(document.querySelectorAll('.menu-item'));

  // Catálogo oficial de sanduíches usado tanto para renderizar botões quanto para filtros
  const sandwiches = [
    { id: 'tradizionale', name: 'Tradizionale', ingredients: ['pão ciabatta', 'presunto cozido', 'manjericão', 'nozes pecan', 'azeite extra virgem', 'queijo muçarela', 'pasta de dio'] },
    { id: 'caprese', name: 'Caprese', ingredients: ['pão ciabatta', 'queijo de búfala', 'tomate assado', 'manjericão', 'azeite extra virgem', 'pasta de dio'] },
    { id: 'buon', name: 'Buon', ingredients: ['pão ciabatta', 'mortadela bologna', 'tomate assado', 'rúcula', 'queijo colonial', 'azeite extra virgem', 'pasta de dio'] },
    { id: 'speciale', name: 'Speciale', ingredients: ['pão ciabatta', 'mortadela bologna', 'cebola assada', 'queijo muçarela', 'azeite extra virgem', 'pasta de dio'] },
    { id: 'bellissimo', name: 'Bellissimo', ingredients: ['pão ciabatta', 'presunto parma', 'rúcula', 'cebola assada', 'queijo colonial', 'azeite extra virgem', 'pasta de dio'] },
    { id: 'bravo', name: 'Bravo', ingredients: ['pão ciabatta', 'presunto cozido', 'rúcula', 'pesto de manjericão', 'nozes pecan', 'queijo provolone', 'pasta de dio'] },
    { id: 'affamato', name: 'Affamato', ingredients: ['pão ciabatta', 'mortadela bologna', 'tomate assado', 'nozes pecan', 'queijo muçarela', 'azeite extra virgem', 'pasta de dio'] },
    { id: 'che-bello', name: 'Che Bello', ingredients: ['pão ciabatta', 'presunto parma', 'rúcula', 'pesto de manjericão', 'nozes pecan', 'queijo muçarela', 'mel', 'pasta de dio'] },
    { id: 'amore-mio', name: 'Amore Mio', ingredients: ['pão ciabatta', 'presunto parma', 'nozes pecan', 'tomate assado', 'queijo de búfala', 'azeite extra virgem', 'pasta de dio'] },
    { id: 'fame', name: 'Fame', ingredients: ['pão ciabatta', 'presunto cozido', 'tomate assado', 'queijo parmesão', 'azeite extra virgem', 'pasta de dio'] },
    { id: 'miscela', name: 'Miscela', ingredients: ['pão ciabatta', 'pasta de dio', 'manjericão', 'queijo parmesão', 'nozes pecan', 'cebola assada', 'azeite extra virgem'] },
    { id: 'verdure', name: 'Verdure', ingredients: ['pão ciabatta', 'pasta de dio', 'manjericão', 'tomate assado', 'cebola assada', 'azeite extra virgem'] },
    { id: 'asurdo', name: 'Asurdo', ingredients: ['pão ciabatta', 'pastrami', 'picles de pepino', 'queijo colonial', 'azeite extra virgem', 'pasta de dio'] },
    { id: 'fico', name: 'Fico', ingredients: ['pão ciabatta', 'presunto parma', 'pesto de pistache', 'figo em calda', 'queijo colonial', 'pasta de dio'] }
  ];

  // Map serve para recuperar rapidamente o card correspondente a cada sanduíche
  const menuMap = new Map();
  menuItems.forEach(item => menuMap.set(item.dataset.name, item));

  // searchIndex mistura nome + ingredientes para acelerar a busca textual
  sandwiches.forEach(sandwich => {
    sandwich.searchIndex = `${sandwich.name} ${sandwich.ingredients.join(' ')}`.toLowerCase();
  });

  // Regras para montar links do WhatsApp respeitando device e fallback
  const whatsappPhone = '5551999999999';
  const messageFor = sandwichName => `Olá, gostaria de pedir o sanduíche ${sandwichName}`;
  const isAndroid = /android/i.test(navigator.userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  /**
   * Gera o melhor link de pedido possível para o dispositivo atual.
   * Em Android usamos intents nativas; no iOS tentamos whatsapp://; se nada funcionar usamos wa.me.
   */
  const buildOrderLink = sandwichName => {
    const encodedMessage = encodeURIComponent(messageFor(sandwichName));
    const waMeLink = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;

    if (isAndroid) {
      const buildIntent = pkg =>
        `intent://send/?phone=${whatsappPhone}&text=${encodedMessage}#Intent;scheme=whatsapp;package=${pkg};S.browser_fallback_url=${encodeURIComponent(waMeLink)};end`;

      return {
        href: waMeLink,
        android: {
          business: buildIntent('com.whatsapp.w4b'),
          consumer: buildIntent('com.whatsapp')
        }
      };
    }

    if (isIOS || isStandalone) {
      return {
        href: `whatsapp://send?phone=${whatsappPhone}&text=${encodedMessage}`
      };
    }

    return { href: waMeLink };
  };

  /**
   * Garante que cada card tenha um botão "Pedir agora" com deep link do WhatsApp.
   * A função é segura para múltiplas execuções porque evita adicionar botões duplicados.
   */
  const ensureOrderButtons = () => {
    menuItems.forEach(item => {
      const itemContent = item.querySelector('.item-content');
      if (!itemContent || itemContent.querySelector('.order-button')) return;

      const sandwichData = sandwiches.find(s => s.id === item.dataset.name);
      const sandwichName = sandwichData ? sandwichData.name : itemContent.querySelector('h3')?.childNodes[0]?.textContent.trim() || 'Giallo';
      const linkConfig = buildOrderLink(sandwichName);

      const actions = document.createElement('div');
      actions.className = 'card-actions';

      const orderButton = document.createElement('a');
      orderButton.className = 'order-button';
      orderButton.href = linkConfig.href;
      orderButton.target = '_blank';
      orderButton.rel = 'noopener';
      orderButton.innerHTML = `
        <span class="order-button__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false">
            <circle cx="12" cy="12" r="12" fill="#25D366" />
            <path fill="#ffffff" d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.672.149-.198.297-.768.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.298-.495.099-.198.05-.372-.025-.521-.074-.149-.671-1.611-.92-2.206-.242-.579-.487-.5-.672-.51-.173-.009-.371-.011-.57-.011-.198 0-.521.074-.793.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
        </span>
        <span class="order-button__label">Pedir agora</span>
      `;
      orderButton.setAttribute('aria-label', `Pedir sanduíche ${sandwichName} pelo WhatsApp`);

      if (linkConfig.android) {
        orderButton.addEventListener('click', event => {
          event.preventDefault();
          window.location.href = linkConfig.android.business;
          setTimeout(() => {
            window.location.href = linkConfig.android.consumer;
          }, 500);
          setTimeout(() => {
            window.location.href = linkConfig.href;
          }, 1000);
        });
      }

      actions.appendChild(orderButton);
      itemContent.appendChild(actions);
    });
  };

  ensureOrderButtons();

  // Definição das categorias para organização visual
  const ingredientCategories = {
    'Queijos': ['queijo muçarela', 'queijo de búfala', 'queijo colonial', 'queijo provolone', 'queijo parmesão'],
    'Embutidos': ['presunto cozido', 'mortadela bologna', 'presunto parma', 'pastrami'],
    'Molhos': ['azeite extra virgem', 'pasta de dio', 'pesto de manjericão', 'pesto de pistache', 'mel'],
    'Vegetais e Outros': ['manjericão', 'nozes pecan', 'tomate assado', 'rúcula', 'cebola assada', 'picles de pepino', 'figo em calda', 'pão ciabatta']
  };

  const getCategory = ingredient => {
    for (const [category, items] of Object.entries(ingredientCategories)) {
      if (items.includes(ingredient)) return category;
    }
    return 'Vegetais e Outros';
  };

  // Criamos um array ordenado com todos os ingredientes possíveis para gerar os chips
  // Removemos 'pão ciabatta' pois é padrão em todos
  const allIngredients = Array.from(new Set(sandwiches.flatMap(s => s.ingredients)))
    .filter(i => i !== 'pão ciabatta')
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));
  // O Set facilita adicionar/remover ingredientes sem duplicidade
  const selectedIngredients = new Set();

  // Normaliza o texto dos chips (capitaliza primeira letra de cada palavra)
  const formatIngredientLabel = text => text.replace(/(^|\s)([a-zà-ú])/g, (match, space, letter) => `${space || ''}${letter.toUpperCase()}`);

  const chipElements = [];



  if (ingredientContainer) {
    // Agrupa ingredientes por categoria
    const ingredientsByCategory = {};
    Object.keys(ingredientCategories).forEach(cat => ingredientsByCategory[cat] = []);

    allIngredients.forEach(ingredient => {
      const cat = getCategory(ingredient);
      if (!ingredientsByCategory[cat]) ingredientsByCategory[cat] = [];
      ingredientsByCategory[cat].push(ingredient);
    });

    // Renderiza as categorias
    Object.entries(ingredientsByCategory).forEach(([category, ingredients]) => {
      if (!ingredients.length) return;

      const categoryWrapper = document.createElement('div');
      categoryWrapper.className = 'ingredient-category-wrapper';

      const categoryTitle = document.createElement('h4');
      categoryTitle.className = 'ingredient-category-title';
      categoryTitle.textContent = category;
      categoryWrapper.appendChild(categoryTitle);

      const categoryGroup = document.createElement('div');
      categoryGroup.className = 'ingredient-category-group';

      ingredients.forEach(ingredient => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'ingredient-chip';
        chip.textContent = formatIngredientLabel(ingredient);
        chip.dataset.ingredient = ingredient;
        chip.setAttribute('aria-pressed', 'false');
        chip.addEventListener('click', () => {
          const isActive = chip.classList.contains('active');

          chip.classList.toggle('active');
          chip.setAttribute('aria-pressed', String(!isActive));
          if (!isActive) {
            selectedIngredients.add(ingredient);
          } else {
            selectedIngredients.delete(ingredient);
          }
          // Após qualquer alteração aplicamos filtros para sincronizar cards e sugestões
          applyFilters();
        });
        categoryGroup.appendChild(chip);
        chipElements.push(chip);
      });

      categoryWrapper.appendChild(categoryGroup);
      ingredientContainer.appendChild(categoryWrapper);
    });
  }

  if (clearFiltersButton) {
    clearFiltersButton.addEventListener('click', () => {
      if (!selectedIngredients.size) return;
      // Limpa seleção e estado visual dos chips de uma vez
      selectedIngredients.clear();
      chipElements.forEach(chip => {
        chip.classList.remove('active');
        chip.setAttribute('aria-pressed', 'false');
      });
      applyFilters();
    });
  }

  /**
   * Calcula ingredientes compatíveis com a combinação atual.
   * Retorna null quando não há filtros para sinalizar "tudo liberado".
   */
  const getCompatibleIngredients = activeIngredients => {
    if (!activeIngredients.length) return null;
    const compatible = new Set(activeIngredients);
    sandwiches.forEach(sandwich => {
      if (activeIngredients.every(ingredient => sandwich.ingredients.includes(ingredient))) {
        sandwich.ingredients.forEach(ingredient => compatible.add(ingredient));
      }
    });
    return compatible;
  };

  /**
   * Mostra apenas os chips que ainda podem formar um sanduíche válido.
   */
  const updateChipAvailability = compatibilitySet => {
    chipElements.forEach(chip => {
      const ingredient = chip.dataset.ingredient;
      const isSelected = selectedIngredients.has(ingredient);
      const shouldHide = Boolean(compatibilitySet && !isSelected && !compatibilitySet.has(ingredient));

      chip.classList.toggle('is-hidden', shouldHide);
    });
  };

  // Helpers visuais para o feedback do limite de ingredientes
  const showLimitWarning = () => {
    if (!limitWarning) return;
    limitWarning.classList.add('is-visible');
    limitWarning.textContent = 'Limite atingido: escolha até três ingredientes.';
  };

  const hideLimitWarning = () => {
    if (!limitWarning) return;
    limitWarning.classList.remove('is-visible');
  };

  const updateFilterSummary = (activeIngredients, compatibilitySet) => {
    if (filterCount) {
      const count = activeIngredients.length;
      const baseText = count
        ? `${count} ${count === 1 ? 'ingrediente selecionado' : 'ingredientes selecionados'}`
        : 'Nenhum ingrediente selecionado';
      if (compatibilitySet && compatibilitySet.size) {
        const available = Math.max(compatibilitySet.size - count, 0);
        filterCount.textContent = `${baseText} · ${available || 'Sem'} opções compatíveis`;
      } else {
        filterCount.textContent = `${baseText} · ${allIngredients.length} ingredientes disponíveis`;
      }
    }

    if (clearFiltersButton) {
      // Desabilitamos o botão limpar quando não há seleção para evitar clique inútil
      clearFiltersButton.disabled = activeIngredients.length === 0;
    }

    hideLimitWarning();
  };

  const applyFilters = () => {
    // Normaliza a busca para combinar com o índice minúsculo
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const activeIngredients = Array.from(selectedIngredients);
    const matches = [];
    const compatibilitySet = getCompatibleIngredients(activeIngredients);

    sandwiches.forEach(sandwich => {
      const itemElement = menuMap.get(sandwich.id);
      const matchesQuery = !query || sandwich.searchIndex.includes(query);
      const matchesIngredients = !activeIngredients.length || activeIngredients.every(ingredient => sandwich.ingredients.includes(ingredient));
      const shouldShow = matchesQuery && matchesIngredients;

      if (itemElement) {
        itemElement.style.display = shouldShow ? '' : 'none';
        itemElement.classList.toggle('match', shouldShow && activeIngredients.length > 0);
      }

      if (shouldShow && activeIngredients.length) {
        matches.push(sandwich);
      }
    });

    // 1) Sugestões personalizadas 2) resumo/aviso 3) bloqueio visual de chips
    updateSuggestions(activeIngredients, matches);
    updateFilterSummary(activeIngredients, compatibilitySet);
    updateChipAvailability(compatibilitySet);

    menuItems.forEach(item => item.classList.remove('single-match'));
    if (matches.length === 1) {
      const singleItem = menuMap.get(matches[0].id);
      if (singleItem) {
        singleItem.classList.add('single-match');
      }
    }
  };

  /**
   * Escreve mensagens amigáveis no painel lateral conforme as combinações escolhidas.
   */
  const updateSuggestions = (activeIngredients, matches) => {
    if (!suggestionPanel) return;

    if (!activeIngredients.length) {
      suggestionPanel.classList.remove('is-active');
      suggestionPanel.innerHTML = '<p>Selecione um ingrediente para receber sugestões personalizadas.</p>';
      return;
    }

    const prettySelection = activeIngredients.map(formatIngredientLabel).join(', ');
    const pillsMarkup = `
      <div class="selection-pills">
        ${activeIngredients.map(ingredient => `<span class="selection-pill">${formatIngredientLabel(ingredient)}</span>`).join('')}
      </div>
    `;
    suggestionPanel.classList.add('is-active');

    if (!matches.length) {
      suggestionPanel.innerHTML = `
        <p>Nenhum sanduíche usa exatamente <strong>${prettySelection}</strong>.</p>
        ${pillsMarkup}
        <p class="mini-note">Dica: remova um ingrediente ou troque por outra combinação.</p>
      `;
      return;
    }

    const listItems = matches
      .map(sandwich => `<li><strong>${sandwich.name}</strong> — combina com ${prettySelection}</li>`)
      .join('');

    suggestionPanel.innerHTML = `
      <p>Sugerimos ${matches.length === 1 ? 'este sanduíche' : 'estes sanduíches'} com <strong>${prettySelection}</strong>:</p>
      ${pillsMarkup}
      <ul>${listItems}</ul>
    `;
  };

  // Busca em tempo real (debounce não é necessário porque a lista é pequena)
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Garantimos que a UI inicie consistente com o estado zero seleções
  applyFilters();
});