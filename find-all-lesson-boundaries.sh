#!/bin/bash

# Script to find all lesson boundaries across all curriculum volumes

echo "🔍 Finding lesson boundaries for all volumes..."

for volume in RCM07_NA_SW_V1 RCM07_NA_SW_V2 RCM08_NA_SW_V1 RCM08_NA_SW_V2; do
    echo ""
    echo "📚 ======= $volume ======="
    
    document_path="/workspaces/MathCurriculumA/webapp_pages/$volume/data/document.json"
    
    if [[ ! -f "$document_path" ]]; then
        echo "❌ Document not found: $document_path"
        continue
    fi
    
    # Get total pages
    total_pages=$(jq -r '.total_pages' "$document_path")
    echo "📄 Total pages: $total_pages"
    echo ""
    
    # Find all lesson start pages
    for lesson in {1..25}; do
        start_page=$(jq -r ".pages[] | select(.text_preview // \"\" | test(\"LESSON\\s+$lesson\\s+\"; \"i\") and (.text_preview // \"\" | contains(\"Dear Family\"))) | .page_number" "$document_path" | head -1)
        
        if [[ "$start_page" != "" && "$start_page" != "null" ]]; then
            # Find the next lesson to determine end page
            next_lesson=$((lesson + 1))
            end_page=""
            
            # Try to find next lesson start
            next_start=$(jq -r ".pages[] | select(.page_number > $start_page and (.text_preview // \"\" | test(\"LESSON\\s+$next_lesson\\s+\"; \"i\")) and (.text_preview // \"\" | contains(\"Dear Family\"))) | .page_number" "$document_path" | head -1)
            
            if [[ "$next_start" != "" && "$next_start" != "null" ]]; then
                end_page=$((next_start - 1))
            else
                # Try finding the next lesson after that
                for next_try in $(seq $((next_lesson + 1)) 25); do
                    next_start=$(jq -r ".pages[] | select(.page_number > $start_page and (.text_preview // \"\" | test(\"LESSON\\s+$next_try\\s+\"; \"i\")) and (.text_preview // \"\" | contains(\"Dear Family\"))) | .page_number" "$document_path" | head -1)
                    if [[ "$next_start" != "" && "$next_start" != "null" ]]; then
                        end_page=$((next_start - 1))
                        break
                    fi
                done
            fi
            
            # If still no end found, use reasonable estimate
            if [[ "$end_page" == "" ]]; then
                end_page=$((start_page + 22))  # Most lessons are ~20-25 pages
                if [[ $end_page -gt $total_pages ]]; then
                    end_page=$total_pages
                fi
            fi
            
            # Get lesson title
            title=$(jq -r ".pages[] | select(.page_number == $start_page) | .text_preview" "$document_path" | grep -oP "LESSON\s+$lesson\s+\K[^\"]*" | head -1 | sed 's/Dear Family.*//' | xargs)
            
            echo "  📖 Lesson $lesson: pages $start_page-$end_page ($((end_page - start_page + 1)) pages) - $title"
            
            # Output in TypeScript format
            echo "      $lesson: { start: $start_page, end: $end_page, title: '$title' },"
        fi
    done
    echo ""
done

echo "✅ Lesson boundary analysis complete!"
