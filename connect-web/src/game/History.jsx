import { createSignal } from "solid-js";
import { numCorrect } from "./Game";

export const [pastGuesses, setPastGuesses] = createSignal([]);

export function PastGuesses() {
    return (<div align="center">
        <h1>
            Past Guesses{
                (pastGuesses().length > 0 ? `: ${numCorrect()}/${pastGuesses().length} (${(numCorrect() / pastGuesses().length * 100).toFixed(2)}%)` : '')
            }
        </h1>
        <table id="pastGuesses">
            <tbody class="scrollMenu">
                <For each={pastGuesses()}>{item =>
                    <tr>
                        <td>
                            <img height="75" width="75" src={item.imageUrl} />
                            <br />
                            <a href={item.refUrl} target="_blank">{item.name}</a>
                            <br />
                            <span>{item.years.start}-{item.years.end}</span>
                            <br />
                            <img src={`/pictures/${item.league}.png`} height="20" width="20" />
                        </td>
                        <td>
                            <For each={Object.entries(item.teams)}>{ty =>
                                <div class="teamYearEntry">
                                    <img src={`/team-logos/${item.league}/${ty[0]}.png`} height="20" width="20" />
                                    <For each={ty[1]}>{yr =>
                                        <Show
                                            when={yr.end - yr.start > 0}
                                            fallback={` (${yr.start})\n`}>
                                            {` (${yr.start}-${yr.end})\n`}
                                        </Show>
                                    }</For>
                                </div>
                            }
                            </For>
                        </td>
                        <Show
                            when={item.correct == true}
                            fallback={<td><img src="/pictures/wrong.png" width="40px" height="40px" /></td>}>
                            <td>
                                <img src="/pictures/correct.png" width="40px" height="40px" />
                                <div class="teamYearEntry">
                                    <img src={`/team-logos/${item.league}/${item.correctTeams[0]}.png`} height="20" width="20" />
                                    <img src={`/team-logos/${item.league}/${item.correctTeams[1]}.png`} height="20" width="20" />
                                </div>
                            </td>
                        </Show>

                    </tr>
                }
                </For>
            </tbody>
        </table>
    </div>);
}