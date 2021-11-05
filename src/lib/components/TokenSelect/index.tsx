import { DAI, ETH, UNI, USDC } from 'lib/mocks'
import styled from 'lib/theme'
import TYPE from 'lib/theme/type'
import { Token } from 'lib/types'
import { useCallback, useEffect, useRef, useState } from 'react'

import Column from '../Column'
import Dialog, { Header } from '../Dialog'
import { StringInput } from '../Input'
import Row from '../Row'
import Rule from '../Rule'
import TokenBase from './TokenBase'
import TokenButton from './TokenButton'
import TokenOption from './TokenOption'

// TODO: integrate with web3-react context
const mockTokens = [DAI, ETH, UNI, USDC]

const SearchInput = styled(StringInput)`
  background-color: ${({ theme }) => theme.container};
  border-radius: ${({ theme }) => (theme.borderRadius ? theme.borderRadius + 0.25 : 0)}em;
  height: unset;
  padding: 0.75em;

  :focus-within {
    outline: 1px solid ${({ theme }) => theme.active};
  }
`

export function TokenSelectDialog({ onChange }: { onChange: (token: Token) => void }) {
  const baseTokens = mockTokens
  const tokens = mockTokens

  const [search, setSearch] = useState('')

  const input = useRef<HTMLInputElement>(null)
  useEffect(() => input.current?.focus(), [input])

  return (
    <>
      <Column gap={0.75}>
        <Header title="Select a token" />
        <Row padded grow>
          <TYPE.body1 color={search ? 'primary' : 'secondary'}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by token name or address"
              ref={input}
            />
          </TYPE.body1>
        </Row>
        {baseTokens && (
          <>
            <Row gap={0.25} justify="flex-start" flex padded>
              {baseTokens.map((token) => (
                <TokenBase value={token} onClick={onChange} key={token.address} />
              ))}
            </Row>
            <Rule padded />
          </>
        )}
      </Column>
      <Column scrollable>
        {tokens && tokens.map((token) => <TokenOption value={token} onClick={onChange} key={token.address} />)}
      </Column>
    </>
  )
}

interface TokenSelectProps {
  value?: Token
  disabled?: boolean
  onChange: (value: Token) => void
}

export default function TokenSelect({ value, disabled, onChange }: TokenSelectProps) {
  const [open, setOpen] = useState(false)
  const onSelect = useCallback(
    (value: Token) => {
      onChange(value)
      setOpen(false)
    },
    [onChange, setOpen]
  )
  return (
    <>
      <TokenButton value={value} disabled={disabled} onClick={() => setOpen(true)} />
      {open && (
        <Dialog color="module" onClose={() => setOpen(false)}>
          <TokenSelectDialog onChange={onSelect} />
        </Dialog>
      )}
    </>
  )
}
