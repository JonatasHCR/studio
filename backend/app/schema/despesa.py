from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, ConfigDict


class DespesaSchema(BaseModel):

    nome: str = Field(..., description="Nome da despesa")
    tipo: str = Field(..., description="Tipo da despesa")
    status: Literal["P", "Q"] = Field(
        ..., description="Status da despesa: P - Pendente, Q - Quitada"
    )
    vencimento: date = Field(..., description="Data de vencimento do ativo")
    valor: float = Field(..., gt=0, description="Valor da despesa")
    user_id: int = Field(..., gt=0, description="Usuário que está relacionado")

    model_config = ConfigDict(from_attributes=True)


class DespesaOutputSchema(DespesaSchema):
    id: int = Field(..., gt=0)
