import { goToQuestion, resetSimulation } from 'Actions/actions'
import Overlay from 'Components/Overlay'
import { useEvaluation } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { formatValue } from 'publicodes'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DottedName } from 'Rules'
import {
	answeredQuestionsSelector,
	situationSelector
} from 'Selectors/simulationSelectors'
import './AnswerList.css'

type AnswerListProps = {
	onClose: () => void
}

export default function AnswerList({ onClose }: AnswerListProps) {
	const dispatch = useDispatch()
	const answeredQuestions = Object.keys(
		useSelector(situationSelector)
	) as Array<DottedName>
	const nextSteps = useNextQuestions()

	return (
		<Overlay onClose={onClose} className="answer-list">
			{!!answeredQuestions.length && (
				<>
					<h2>
						{emoji('📋 ')}
						<Trans>Mes réponses</Trans>
						<small css="margin-left: 2em; img {font-size: .8em}">
							{emoji('🗑')}{' '}
							<button
								className="ui__ simple small button"
								onClick={() => {
									dispatch(resetSimulation())
									onClose()
								}}
							>
								<Trans>Tout effacer</Trans>
							</button>
						</small>
					</h2>
					<StepsTable {...{ rules: answeredQuestions, onClose }} />
				</>
			)}
			{!!nextSteps.length && (
				<>
					<h2>
						{emoji('🔮 ')}
						<Trans>Prochaines questions</Trans>
					</h2>
					<StepsTable {...{ rules: nextSteps, onClose }} />
				</>
			)}
		</Overlay>
	)
}

function StepsTable({
	rules,
	onClose
}: {
	rules: Array<DottedName>
	onClose: () => void
}) {
	const dispatch = useDispatch()
	const evaluatedRules = useEvaluation(rules)
	const language = useTranslation().i18n.language
	return (
		<table>
			<tbody>
				{evaluatedRules
					.filter(rule => rule.isApplicable !== false)
					.map(rule => (
						<tr
							key={rule.dottedName}
							css={`
								background: var(--lightestColor);
							`}
						>
							<td>
								<button
									className="ui__ link-button"
									onClick={() => {
										dispatch(goToQuestion(rule.dottedName))
										onClose()
									}}
								>
									{rule.title}
								</button>
							</td>
							<td>
								<span
									css={`
										display: inline-block;
										padding: 0.2rem;
										color: inherit;
										font-size: inherit;
										width: 100%;
										text-align: start;
										font-weight: 600;
										> span {
											border-bottom-color: var(--textColorOnWhite);
											padding: 0.05em 0em;
											display: inline-block;
										}
									`}
								>
									<span className="answerContent">
										{formatValue(rule, { language })}
									</span>
								</span>{' '}
							</td>
						</tr>
					))}
			</tbody>
		</table>
	)
}
