import { useMemo, useState } from 'react'
import { useAuthStore } from '../../stores/auth-store'

const PIN_LENGTH = 4
const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

export function PinPad() {
    const configuredPin = useAuthStore((state) => state.pin)
    const verifyPin = useAuthStore((state) => state.verifyPin)
    const setPin = useAuthStore((state) => state.setPin)
    const unlock = useAuthStore((state) => state.unlock)

    const [value, setValue] = useState('')
    const [firstPin, setFirstPin] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isSetupMode = !configuredPin
    const isConfirmStep = isSetupMode && firstPin.length === PIN_LENGTH

    const title = useMemo(() => {
        if (!isSetupMode) return 'App bloqueada'
        if (isConfirmStep) return 'Confirma tu PIN'
        return 'Crea tu PIN'
    }, [isConfirmStep, isSetupMode])

    const subtitle = useMemo(() => {
        if (!isSetupMode) return 'Introduce tu PIN para continuar'
        if (isConfirmStep) return 'Repite el PIN de 4 dígitos'
        return 'Configura un PIN de 4 dígitos para proteger tus datos'
    }, [isConfirmStep, isSetupMode])

    const resetEntry = () => {
        setValue('')
        setError('')
    }

    const onDigit = async (digit: string) => {
        if (isSubmitting || value.length >= PIN_LENGTH) return

        const nextValue = `${value}${digit}`
        setValue(nextValue)
        setError('')

        if (nextValue.length !== PIN_LENGTH) return

        setIsSubmitting(true)
        try {
            if (!isSetupMode) {
                const isValid = await verifyPin(nextValue)
                if (!isValid) {
                    setError('PIN incorrecto')
                    setValue('')
                    return
                }

                unlock()
                return
            }

            if (!isConfirmStep) {
                setFirstPin(nextValue)
                setValue('')
                return
            }

            if (nextValue !== firstPin) {
                setError('Los PIN no coinciden')
                setFirstPin('')
                setValue('')
                return
            }

            await setPin(nextValue)
            unlock()
        } finally {
            setIsSubmitting(false)
        }
    }

    const onBackspace = () => {
        if (isSubmitting) return
        setValue((current) => current.slice(0, -1))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gym-cardDark">
                <h2 className="text-center text-xl font-bold">{title}</h2>
                <p className="mt-1 text-center text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>

                <div className="mt-5 flex items-center justify-center gap-3">
                    {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                        <span
                            key={index}
                            className={`h-3 w-3 rounded-full ${index < value.length ? 'bg-gym-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                        />
                    ))}
                </div>

                {error && <p className="mt-3 text-center text-sm font-medium text-red-600">{error}</p>}

                <div className="mt-6 grid grid-cols-3 gap-3">
                    {DIGITS.slice(0, 9).map((digit) => (
                        <button
                            key={digit}
                            type="button"
                            className="h-16 rounded-xl border border-slate-200 text-2xl font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                            onClick={() => void onDigit(digit)}
                        >
                            {digit}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="h-16 rounded-xl border border-slate-200 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        onClick={resetEntry}
                    >
                        Limpiar
                    </button>
                    <button
                        type="button"
                        className="h-16 rounded-xl border border-slate-200 text-2xl font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        onClick={() => void onDigit('0')}
                    >
                        0
                    </button>
                    <button
                        type="button"
                        className="h-16 rounded-xl border border-slate-200 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        onClick={onBackspace}
                    >
                        Borrar
                    </button>
                </div>

                {isSetupMode && (
                    <button
                        type="button"
                        className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
                        onClick={() => unlock()}
                    >
                        Continuar sin PIN
                    </button>
                )}
            </div>
        </div>
    )
}