# Plano de Aula: O Engenheiro Balístico

## 1. Visão Geral
**Objetivo:** Compreender o conceito de derivada como taxa de variação instantânea através da análise de trajetórias de projéteis em um ambiente 3D.
**Público-alvo:** Alunos de Cálculo I ou Física Mecânica.
**Software:** Artefato interativo WebGL (Three.js) + Chart.js, integrado com modelos 3D do Blender.

## 2. Conceitos Matemáticos Abordados
- **Posição $s(t)$:** A função original.
- **Velocidade $v(t) = s'(t)$:** A primeira derivada (inclinação da tangente).
- **Aceleração $a(t) = v'(t) = s''(t)$:** A segunda derivada.
- **Pontos de Máximo:** Onde a derivada é zero ($v(t) = 0$).

## 3. Atividades Propostas

### Atividade 1: A "Tangente Invisível"
- **Ação:** O aluno dispara o projétil e observa o vetor velocidade.
- **Desafio:** "Em que ponto da trajetória o vetor velocidade aponta exatamente para o horizonte?"
- **Explicação:** Identificar visualmente o ponto onde a componente vertical da derivada é nula.

### Atividade 2: Sincronia Gráfico-Espacial
- **Ação:** Utilizar o "scrubber" (barra de tempo) para navegar na animação.
- **Análise:** Comparar o pico da parábola no mundo 3D com o ponto onde o gráfico da velocidade cruza o eixo zero.
- **Discussão:** Por que a aceleração (segunda derivada) permanece constante enquanto a velocidade muda?

### Atividade 3: Modificação de Ambiente (Blender)
- **Ação:** Alunos abrem o arquivo `.blend`, adicionam um obstáculo (ex: um muro) em uma coordenada específica.
- **Desafio:** Calcular a derivada necessária (ângulo e força) para que o projétil ultrapasse o obstáculo com a menor margem possível.

## 4. Como usar este Artefato
1. **Explore:** Use os sliders para mudar força e ângulo.
2. **Visualize:** Observe os vetores mudando em tempo real.
3. **Analise:** Olhe para os gráficos laterais para ver a "matemática por trás do movimento".
4. **Itere:** Volte ao Blender para criar novos cenários e exporte novamente para ver como a matemática se adapta ao novo mundo.
