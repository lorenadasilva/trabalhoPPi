import express from 'express';

const app = express();
const porta = 3000;

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));

// Página inicial com formulário
app.get("/", (req, res) => {
    res.send(`
        <h2>Reajuste de Salário</h2>
        <form action="/resultado" method="POST">
            Idade: <input type="number" name="idade" required><br><br>
            Sexo: 
            <select name="sexo" required>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
            </select><br><br>
            Salário base: <input type="number" name="salario" step="0.01" required><br><br>
            Ano da contratação: <input type="number" name="ano" required><br><br>
            Matrícula: <input type="number" name="matricula" required><br><br>
            <button type="submit">Calcular</button>
        </form>
    `);
});

// Página de resultado
app.post("/resultado", (req, res) => {
    const { idade, sexo, ano, matricula, salario } = req.body;

    const idadeNum = parseInt(idade);
    const salarioNum = parseFloat(salario);
    const anoNum = parseInt(ano);
    const anoAtual = new Date().getFullYear();
    const tempo = anoAtual - anoNum;

    let reajuste = 0;
    let desconto = 0;
    let acrescimo = 0;

    if (idadeNum >= 18 && idadeNum <= 38) {
        if (sexo === "M") {
            reajuste = 10;
            desconto = 10;
            acrescimo = 17;
        } else {
            reajuste = 8;
            desconto = 11;
            acrescimo = 16;
        }
    } else if (idadeNum >= 40 && idadeNum <= 69) {
        if (sexo === "M") {
            reajuste = 10;
            desconto = 7.5;
            acrescimo = 14;
        } else {
            reajuste = 9;
            desconto = 5;
            acrescimo = 15;
        }
    } else if (idadeNum >= 70 && idadeNum <= 99) {
        if (sexo === "M") {
            reajuste = 15;
            desconto = 13;
            acrescimo = 13;
        } else {
            reajuste = 17;
            desconto = 12;
            acrescimo = 12;
        }
    }

    let novoSalario = salarioNum + (salarioNum * reajuste / 100);
    if (tempo <= 10) {
        novoSalario -= desconto;
    } else {
        novoSalario += acrescimo;
    }

    res.send(`
        <h2>Resultado do Reajuste</h2>
        Matrícula: ${matricula}<br>
        Idade: ${idadeNum}<br>
        Sexo: ${sexo}<br>
        Salário base: R$ ${salarioNum.toFixed(2)}<br>
        Ano de Contratação: ${anoNum}<br>
        Tempo de Empresa: ${tempo} anos<br>
        Reajuste: ${reajuste}%<br>
        <b>Salário Final: R$ ${novoSalario.toFixed(2)}</b><br><br>
        <a href="/">Voltar</a>
    `);
});

// Iniciar servidor
app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});
