import Transaction from '../models/Transaction'

interface Balance {
  income: number
  outcome: number
  total: number
}

interface CreateTransactionDTO {
  title: string
  value: number
  type: 'income' | 'outcome'
}

class TransactionsRepository {
  private transactions: Transaction[]

  constructor() {
    this.transactions = []
  }

  public all(): Transaction[] {
    return this.transactions
  }

  public getBalance(): Balance {
    return this.transactions.reduce<Balance>(
      (accum, transaction) => {
        switch (transaction.type) {
          case 'income':
            return {
              ...accum,
              income: accum.income + transaction.value,
              total: accum.total + transaction.value,
            }
          case 'outcome':
            return {
              ...accum,
              outcome: accum.outcome + transaction.value,
              total: accum.total - transaction.value,
            }
          default:
            return {
              ...accum,
            }
        }
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    )
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, type, value })

    this.transactions.push(transaction)

    const currentBalance = this.getBalance()
    if (currentBalance.total < 0) {
      this.transactions.pop()

      throw new Error('Cannot have a negative Balance!')
    }

    return transaction
  }
}

export default TransactionsRepository
